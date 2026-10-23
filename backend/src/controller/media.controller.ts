import { Request, Response } from "express";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";
import { userModel, mediaModel } from "../model/database/index.js";
import { mediaTranscodingQueue } from "../queues/mediaTranscoding.queue.js";
import { AppError } from "../utils/AppError.js";
import { mediaModifyingSchema } from "../validators/media.validation.js";

const mediaUploading = async (req: Request, res: Response) => {
    const { isAuthenticated, authenticatedUserData } = req;
    if (!isAuthenticated || !authenticatedUserData)
        throw new AppError('Invalid Request', 400);

    const { _id: artistObjectID, userName: artistName, userID: artistUserID } = authenticatedUserData;
    const { mediaType } = req.body;

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

    const artistData = await userModel.findOneAndUpdate({ $and: [{ _id: artistObjectID }, { userName: artistName }, { userID: artistUserID }] },
        { $push: { "mediaFiles.videoFiles": mediaModelResult._id } }
    );

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
        artistData
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

const getAllMedia = async (req: Request, res: Response) => {
    const { isAuthenticated, authenticatedUserData } = req;
    const fileType = req.query.fileType?.toString().toLowerCase();

    if (!isAuthenticated || !authenticatedUserData) {
        throw new AppError("Unauthorized", 401);
    }

    if (fileType && !["video", "audio"].includes(fileType)) {
        throw new AppError("Invalid fileType", 400);
    }

    const { _id: artistObjectID, userName: artistName, userID: artistUserID } = authenticatedUserData;

    if (!mongoose.isValidObjectId(artistObjectID)) {
        throw new AppError("Invalid artist ObjectId", 400);
    }

    const query = {
        "artist.artistName": artistName,
        "artist.artistObjectID": artistObjectID,
        "artist.artistUserID": artistUserID,
        resourceType: "media",
        ...(fileType && { mediaType: fileType })
    };

    const mediaData = await mediaModel.find(query);

    return res.status(204).json({
        success: true,
        count: mediaData.length,
        data: mediaData
    });
};

const getMediaById = async (req: Request, res: Response) => {
    const { authenticatedUserData } = req;
    const mediaFileID = req.params.id;

    const { _id: artistObjectID, userName: artistName, userID: artistUserID } = authenticatedUserData;

    if (!mediaFileID || !mongoose.isValidObjectId(mediaFileID))
        throw new AppError('File ID missing/invalid', 401);

    const requestedFile = await mediaModel.find({
        _id: mediaFileID,
        "artist.artistName": artistName,
        "artist.artistObjectID": artistObjectID,
        "artist.artistUserID": artistUserID,
    });

    if (!requestedFile)
        throw new AppError('File not found', 404);

    res.status(204).json({
        status: true,
        data: requestedFile
    });

};

const modifyMediaFile = async(req: Request, res: Response) => {
    const mediaFileID = req.params.id;
    const result = await mediaModifyingSchema.safeParseAsync(req.body);
    const { authenticatedUserData } = req;

    if(!result.success)
        throw new AppError('Invalid/Missing fields to modify', 403);

    if (!mediaFileID || !mongoose.isValidObjectId(mediaFileID))
        throw new AppError('File ID missing/invalid', 401);

    const { mediaName, newMediaName } = result.data;
    const { _id: artistObjectID, userName: artistName, userID: artistUserID } = authenticatedUserData;

    const modifyFileData = await mediaModel.findOneAndUpdate({
        _id: mediaFileID,
        mediaName,
        "artist.artistName": artistName,
        "artist.artistObjectID": artistObjectID,
        "artist.artistUserID": artistUserID,
    },
    {
        $set: { mediaName: newMediaName } 
    },
);

    if(!modifyFileData)
        throw new AppError('No file found to update', 404);

    res.status(200).json({
        status: true,
        message: 'File updated successfully',
        data: modifyFileData,
    });
};


export {
    mediaUploading,
    mediaStreaming,
    getAllMedia,
    getMediaById,
    modifyMediaFile
}