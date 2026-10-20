import "../config/database/connection.js";
import { Worker } from "bullmq";
import mediaModel from "../model/database/media.model.js";
import { createHls } from "../utils/createHLS.js";
import { createHLSAudio } from "../utils/createHLS.audio.js";

async function main() {

    const worker = new Worker("media-transcoding", async (job) => {
        console.log(`Processing Job ID ${job.id}`);
        console.log('Job data ', job.data);

        const { mediaFileID } = job.data;
        const mediaFileData = await mediaModel.findById(mediaFileID);

        if (!mediaFileData)
            throw new Error(`Media file not found ${mediaFileID}`);

        console.log(`Found media file: ${mediaFileData._id}`);

        mediaFileData.fileStatus = "PROCESSING";
        await mediaFileData.save();


        const hlsResult = mediaFileData.mediaType === "video" ?
            await createHls(mediaFileData._id.toString(), mediaFileData.cloudURL) :
            await createHLSAudio(mediaFileData._id.toString(), mediaFileData.cloudURL);
            
        const { outputDir, masterPlaylistPath, variants } = hlsResult;

        mediaFileData.outputDir = outputDir;
        mediaFileData.masterPlaylistPath = masterPlaylistPath;

        mediaFileData.variant.push(...variants);
        mediaFileData.fileStatus = "READY";
        await mediaFileData.save();

        console.log("Job handled successfully:", job.id);

        return {
            videoId: mediaFileData._id.toString(),
            message: "Worker test completed",
        };
    }, {
        connection: {
            host: '127.0.0.1',
            port: 6379
        },
        concurrency: 1,
    });

    worker.on("completed", (job, result) => {
        console.log("Job completed:", job.id, result);
    });

    worker.on("failed", (job, error) => {
        console.error("Job failed:", job?.id, error.message);
    });

    worker.on("error", (error) => {
        console.error("Worker error:", error);
    });

    console.log("Media transcoding worker started");
}

main().catch((error) => {
    console.error("Worker startup failed:", error);
    process.exitCode = 1;
});
