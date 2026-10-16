import express from 'express';
import { videoStream, videoTranscoding, videoUploading } from '../controller/video.controllers.js';
import upload from '../middleware/upload.middleware.js';

export const router = express.Router();


router.get('/video', videoStream);
router.get('/video/transcode', videoTranscoding);
router.post('/video/upload', upload.single("media"), videoUploading);