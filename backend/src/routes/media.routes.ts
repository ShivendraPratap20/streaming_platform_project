import express, { Request, Response} from "express";
import { mediaUploading, mediaStreaming, getAllMedia, getMediaById, modifyMediaFile, deleteMediaFile } from "../controller/media.controller.js";
import upload from '../middleware/upload.middleware.js';
import authMiddleware from "../middleware/auth.middleware.js";

const mediaRouter = express.Router();

mediaRouter.post("/upload", authMiddleware, upload.single("media"), mediaUploading);
mediaRouter.get("/:id/stream", mediaStreaming);
mediaRouter.get("/", authMiddleware, getAllMedia);
mediaRouter.get("/:id", authMiddleware, getMediaById);
mediaRouter.put("/:id", authMiddleware, modifyMediaFile);
mediaRouter.delete("/:id", authMiddleware, deleteMediaFile);

export default mediaRouter;