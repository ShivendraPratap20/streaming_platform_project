import "../config/database/connection.js";
import { Worker } from "bullmq";
import videoModel from "../model/database/videoModel.js";
import { transcodeVideo } from "../utils/transcodeVideo.js";
import { cloudinary } from "../config/cloudinary.js";

async function main() {

    const worker = new Worker("video-transcoding", async (job) => {
        console.log(`Processing Job ID ${job.id}`);
        console.log('Job data ', job.data);

        const { videoId } = job.data;
        const video = await videoModel.findById(videoId);

        if (!video)
            throw new Error(`Video not found ${videoId}`);

        console.log(`Found video: ${video._id}`);

        video.fileStatus = "PROCESSING",
            await video.save();

        const { workDir, outputs } = await transcodeVideo(video.url);

        console.log('Result after transcoding ', outputs);

        const uploadedVariants = await Promise.all(
            outputs.map(async (value) => {
                const result = await cloudinary.uploader.upload(value.filePath, {
                    resource_type: "video",
                    folder: `streaming-app/media/video/${videoId}/${value.resolution}p`,
                    public_id: `streaming-app/media/video/${videoId}/${value.resolution}p`,
                    overwrite: true,
                });

                return {
                    resolution: value.resolution,
                    url: result.url,
                    publicId: result.public_id,
                };
            })
        );

        video.variant.push(...uploadedVariants);
        video.fileStatus = "READY";
        await video.save();

        console.log("Job handled successfully:", job.id);

        return {
            videoId: video._id.toString(),
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

    console.log("Video transcoding worker started");
}

main().catch((error) => {
    console.error("Worker startup failed:", error);
    process.exitCode = 1;
});
