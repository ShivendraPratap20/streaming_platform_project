import express, { Request, Response} from "express";
import { mediaUploading, mediaStreaming } from "../controller/media.controller.js";
import upload from '../middleware/upload.middleware.js';


const mediaRouter = express.Router();

mediaRouter.post("/upload", upload.single("media"), mediaUploading);
mediaRouter.get("/:id/stream", mediaStreaming);

export default mediaRouter;