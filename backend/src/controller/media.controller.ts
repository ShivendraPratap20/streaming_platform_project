import { Request, Response } from "express";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";
import mediaModel from "../model/database/media.model.js";
import { mediaTranscodingQueue } from "../queues/mediaTranscoding.queue.js";
import { AppError } from "../utils/AppError.js";

const mediaUploading = async (req: Request, res: Response) => {
    const { artistName, artistObjectID, artistUserID, mediaType } = req.body;

    if (!req.file || (mediaType !== "video" && mediaType !== "audio")) {
        throw new AppError("Please upload an audio or video file.", 400);
    }

    if (!mongoose.isValidObjectId(artistObjectID)) {
        throw new AppError("Invalid artist ObjectId", 400);
    }

    const cloudUploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
            resource_type: 'video',
            folder: `streaming-app/media/${mediaType}`,
        }
    );

    const { originalname, size, mimetype } = req.file;
    const { format, duration, public_id, url } = cloudUploadResult;

    const mediaModelResult = new mediaModel({
        mediaName: originalname,
        mediaType: mediaType.toLowerCase(),
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
        cloudURL: url,
        fileStatus: "UPLOADED",
    });
    await mediaModelResult.save();

    const job = await mediaTranscodingQueue.add(
        "transcode-media",
        {
            mediaFileID: mediaModelResult._id.toString(),
        },
        {
            jobId: `media-transcode-${mediaModelResult._id.toString()}`,
        }
    );

    mediaModelResult.fileStatus = "QUEUED";
    await mediaModelResult.save();

    return res.status(201).json({
        message: "Media uploaded successfully.",
        media: {
            publicId: cloudUploadResult.public_id,
            url: cloudUploadResult.secure_url,
            resourceType: cloudUploadResult.resource_type,
            format: cloudUploadResult.format,
            bytes: cloudUploadResult.bytes,
            duration: cloudUploadResult.duration,
            status: "QUEUED",
        },
    })
}

const mediaStreaming = async (req: Request, res: Response) => {
    const mediaID = req.params.id;

    if (typeof mediaID !== 'string' || !mongoose.isValidObjectId(mediaID))
        throw new AppError('Invalid ID or missing', 404);

    const mediaData = await mediaModel.findOne({ _id: new mongoose.Types.ObjectId(mediaID) });

    if (!mediaData)
        throw new AppError('Media not found', 404);

    res.status(200).json({
        status: true,
        data: mediaData,
    })
};

export {
    mediaUploading,
    mediaStreaming
}