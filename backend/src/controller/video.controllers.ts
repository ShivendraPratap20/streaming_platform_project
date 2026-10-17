import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { parseRange, runFFmpeg, dummyVideoData } from "../utils/index.js";
import { AppError } from "../utils/AppError.js";
import { cloudinary } from "../config/cloudinary.js";
import videoModel from "../model/database/videoModel.js";

const HLS_ROOT = path.resolve("/home/cvendra/hls-output");

const videoStream = async (req: Request, res: Response) => {
    try {
        const rangeHeader = req.headers.range;
        const videoPath: string = '/home/cvendra/Downloads/RE2012.mkv';
        const fileInfo = await stat(videoPath);


        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Type", "video/mkv");
        res.setHeader("Cache-Control", "no-transform");
        if (req.method === "HEAD") {
            res.status(200);
            res.setHeader("Content-Length", fileInfo.size);
            res.end();
            return;
        }
        if (!rangeHeader) {
            res.status(200);
            res.setHeader("Content-Length", fileInfo.size);

            try {
                await pipeline(createReadStream(videoPath), res);
            } catch (error) {
                if (!res.destroyed) {
                    res.destroy(error as Error);
                }
            }

            return;
        }

        const range = parseRange(rangeHeader, fileInfo.size);

        if (!range) {
            res.status(416);
            res.setHeader("Content-Range", `bytes */${fileInfo.size}`);
            res.end();
            return;
        }

        const { start, end } = range;
        const chunkSize = end - start + 1;

        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${fileInfo.size}`);
        res.setHeader("Content-Length", chunkSize);

        try {
            await pipeline(
                createReadStream(videoPath, { start, end }),
                res
            );
        } catch (error) {
            if (!res.destroyed) {
                res.destroy(error as Error);
            }
        }

    } catch (error) {

    }
}


const videoTranscoding = async (req: Request, res: Response) => {
    try {
        if (dummyVideoData.transcodingStatus === "processing") {
            return res.status(409).json({
                message: "Video is already being transcoded",
            });
        }
        const inputPath = dummyVideoData.path;

        if (!inputPath || !path.isAbsolute(inputPath)) {
            return res.status(400).json({
                message: "Video must have a valid absolute file path",
            });
        }
        await fsp.access(inputPath, fs.constants.R_OK);
        const outputDir = path.join(
            HLS_ROOT,
            dummyVideoData.id.toString()
        );

        await fsp.rm(outputDir, {
            recursive: true,
            force: true,
        });
        for (let i = 0; i < 4; i++) {
            await fsp.mkdir(path.join(outputDir, `v${i}`), {
                recursive: true,
            });
        }

        dummyVideoData.transcodingStatus = "processing";

        const filter = [
            "[0:v]split=4[v0][v1][v2][v3]",
            "[v0]scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2[out0]",
            "[v1]scale=w='min(1280,iw)':h='min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2[out1]",
            "[v2]scale=w='min(854,iw)':h='min(480,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2[out2]",
            "[v3]scale=w='min(640,iw)':h='min(360,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2[out3]",
        ].join(";");

        let hasAudio: boolean = false;

        const args = [
            "-hide_banner",
            "-y",
            "-i", inputPath,

            "-filter_complex", filter,

            "-map", "[out0]",
            ...(hasAudio ? ["-map", "0:a:0"] : []),

            "-map", "[out1]",
            ...(hasAudio ? ["-map", "0:a:0"] : []),

            "-map", "[out2]",
            ...(hasAudio ? ["-map", "0:a:0"] : []),

            "-map", "[out3]",
            ...(hasAudio ? ["-map", "0:a:0"] : []),

            "-c:v", "libx264",
            ...(hasAudio ? ["-c:a", "aac"] : []),

            "-b:v:0", "5000k",
            "-b:v:1", "2800k",
            "-b:v:2", "1400k",
            "-b:v:3", "800k",

            ...(hasAudio ? ["-b:a", "128k"] : []),

            "-f", "hls",
            "-hls_time", "6",
            "-hls_playlist_type", "vod",
            "-hls_flags", "independent_segments",
            "-master_pl_name", "master.m3u8",

            "-var_stream_map",
            hasAudio
                ? "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3"
                : "v:0 v:1 v:2 v:3",

            "-hls_segment_filename",
            path.join(outputDir, "v%v", "segment_%03d.ts"),

            path.join(outputDir, "v%v", "index.m3u8"),
        ];

        await runFFmpeg(args);
        dummyVideoData.transcodingStatus = "ready";
        dummyVideoData.hlsPath = `/hls-output/${dummyVideoData.id}/master.m3u8`;

        return res.status(200).json({
            message: "Transcoding completed",
            videoId: dummyVideoData.id,
            status: "ready",
            masterPlaylist: dummyVideoData.hlsPath,
            qualities: [1080, 720, 480, 360],
        });
    } catch (error) {
        console.log(`[VOD_TRANSCODING_ERR] ${error}`);
        res.status(505).json({
            status: false, message: 'Internal server error', error: {
                code: `VDO_TRANSCODING_ERR`,
                details: error
            }
        })
    }
}

const videoUploading = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an audio or video file.",
            });
        }
        const { artistName, artistObjectID, artistUserID } = req.body;

        if (!mongoose.isValidObjectId(artistObjectID)) {
            return res.status(400).json({
                message: "Invalid artist ObjectId",
            });
        }

        const cloudUploadResult = await cloudinary.uploader.upload(
            req.file.path,
            {
                resource_type: 'video',
                folder: 'streaming-app/media/video'
            }
        );

        const { originalname, size, mimetype } = req.file;
        const { format, duration, public_id, url } = cloudUploadResult;

        const videoModelResult = new videoModel({
            videoName: originalname,
            originalVideoName: originalname,
            mediaType: "VIDEO",
            artist: {
                artistName,
                artistObjectID: new mongoose.Types.ObjectId(artistObjectID),
                artistUserID
            },
            mediaDetails: {
                format,
                duration,
                size,
                mimeType: mimetype,
            },
            publicID: public_id,
            url,
            fileStatus: "SUCCESS",
        });
        await videoModelResult.save();

        return res.status(201).json({
            message: "Media uploaded successfully.",
            media: {
                publicId: cloudUploadResult.public_id,
                url: cloudUploadResult.secure_url,
                resourceType: cloudUploadResult.resource_type,
                format: cloudUploadResult.format,
                bytes: cloudUploadResult.bytes,
                duration: cloudUploadResult.duration,
            },
        })
    } catch (error) {
        console.log(`VIDEO_UPLOAD_ERROR ${error}`);
        res.status(500).json({
            status: false,
            message: 'Video uploading failed',
            error: {
                code: `[VIDEO_UPLOAD_ERROR]`,
                details: error
            }
        })
    }
}

export {
    videoStream,
    videoTranscoding,
    videoUploading
}