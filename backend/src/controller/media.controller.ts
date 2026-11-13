import { Request, Response } from "express";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";
import { userModel, mediaModel } from "../model/database/index.js";
import { mediaTranscodingQueue } from "../queues/mediaTranscoding.queue.js";
import { AppError } from "../utils/AppError.js";
import { mediaUploadingSchema, mediaModifyingSchema } from "../validators/media.validation.js";

const mediaUploading = async (req: Request, res: Response) => {
    const { isAuthenticated, authenticatedUserData } = req;
    if (!isAuthenticated || !authenticatedUserData)
        throw new AppError('Invalid Request', 400);

    const { _id: artistObjectID, userName: artistName, userID: artistUserID } = authenticatedUserData;
    let { mediaType, aboutMediaInfo } = req.body;

    const result = await mediaUploadingSchema.safeParseAsync({ artistObjectID, artistName, artistUserID, mediaType, aboutMediaInfo });

    if (!result.success)
        throw new AppError('Invalid media meta data', 400, true, result.error.flatten());

    if (!req.file || (mediaType !== "video" && mediaType !== "audio")) {
        throw new AppError("Please upload an audio or video file.", 400);
    }

    if (!mongoose.isValidObjectId(artistObjectID)) {
        throw new AppError("Invalid artist ObjectId", 400);
    }

    mediaType = req.file.mimetype.slice(0, req.file.mimetype.indexOf("/"));

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

    const fileArrayName = (mediaType == 'video') ?
        {
            "mediaFiles.videoFiles": mediaModelResult._id
        } : {
            "mediaFiles.audioFiles": mediaModelResult._id
        };
    const artistData = await userModel.findOneAndUpdate({ $and: [{ _id: artistObjectID }, { userName: artistName }, { userID: artistUserID }] },
        { $push: fileArrayName }
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
        status: true,
        message: "Media uploaded successfully.",
        data: {
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

const modifyMediaFile = async (req: Request, res: Response) => {
    const mediaFileID = req.params.id;
    const result = await mediaModifyingSchema.safeParseAsync(req.body);
    const { authenticatedUserData } = req;

    if (!result.success)
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

    if (!modifyFileData)
        throw new AppError('No file found to update', 404);

    res.status(200).json({
        status: true,
        message: 'File updated successfully',
        data: modifyFileData,
    });
};

const deleteMediaFile = async (req: Request, res: Response) => {
    const mediaFileID = req.params.id;
    const { authenticatedUserData } = req;

    if (!mediaFileID || !mongoose.isValidObjectId(mediaFileID))
        throw new AppError('Invalid media file ID', 401);

    const { _id: artistObjectID, userName: artistName, userID: artistUserID } = authenticatedUserData;

    const deleteFileData = await mediaModel.findOneAndDelete(
        {
            _id: mediaFileID,
            "artist.artistName": artistName,
            "artist.artistObjectID": artistObjectID,
            "artist.artistUserID": artistUserID,
        }
    )

    if (!deleteFileData)
        throw new AppError('No file found to update', 404);

    res.status(200).json({
        status: true,
        message: 'File updated successfully',
        data: deleteFileData,
    });
};

const getTrendingMedia = async (req: Request, res: Response) => {
    let trendingMedia = await mediaModel.find({}).sort({ playCount: -1 }).limit(5);
    res.status(202).json({ status: true, data: trendingMedia, count: trendingMedia.length });
};

const getHomePageMedia = async (req: Request, res: Response) => {
    let trendingMedia = await mediaModel.find({}).sort({ playCount: -1 }).limit(5);
    let movieMedia = await mediaModel.find({ mediaType: "video" }).sort({ playCount: -1 }).limit(5);
    let musicMedia = await mediaModel.find({ mediaType: "audio" }).sort({ playCount: -1 }).limit(5);

    res.status(202).json({
        status: true,
        data: {
            trendingMedia,
            movieMedia,
            musicMedia
        },
        count: {
            trendingMediaCount: trendingMedia.length,
            movieMediaCount: movieMedia.length,
            musicMediaCount: musicMedia.length
        }
    });
};

const getDashboardData = async (req: Request, res: Response) => {
    // const { authenticatedUserData } = req;

    // if (!authenticatedUserData)
    //     throw new AppError('Bad request', 400);

    // const { _id: artistObjectID, userName: artistName, userID: artistUserID } = authenticatedUserData;

    const artistUserID: string = "priya_rai_8";
    const artistName: string = "Priya Kumari";

    const data = await mediaModel.aggregate([
        {
            $match: {
                "artist.artistUserID": artistUserID,
                "artist.artistName": artistName
            }
        },
        {
            $facet: {
                totalMedia: [
                    {
                        $count: "count"
                    }
                ],

                videoMedia: [
                    {
                        $match: { mediaType: "video" }
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            files: { $push: "$$ROOT" }
                        }
                    }
                ],

                audioMedia: [
                    {
                        $match: { mediaType: "audio" }
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            files: { $push: "$$ROOT" }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                totalMediaCount: {
                    $ifNull: [
                        { $arrayElemAt: ["$totalMedia.count", 0] },
                        0
                    ]
                },
                videoMedia: {
                    $ifNull: [
                        { $arrayElemAt: ["$videoMedia", 0] },
                        { count: 0, files: [] }
                    ]
                },
                audioMedia: {
                    $ifNull: [
                        { $arrayElemAt: ["$audioMedia", 0] },
                        { count: 0, files: [] }
                    ]
                }
            }
        },
        {
            $project: {
                totalMediaCount: 1,
                videoMedia: {
                    count: 1,
                    files: 1
                },
                audioMedia: {
                    count: 1,
                    files: 1
                }
            }
        }
    ]);

    res.status(200).json({ status: true, message: 'Ok', data });
};

export {
    mediaUploading,
    mediaStreaming,
    getAllMedia,
    getMediaById,
    modifyMediaFile,
    deleteMediaFile,
    getTrendingMedia,
    getHomePageMedia,
    getDashboardData,
}