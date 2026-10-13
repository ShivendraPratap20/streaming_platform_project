import express from 'express';
import { videoStream, videoTranscoding } from '../controller/video.controllers.js';


export const router = express.Router();


router.get('/video', videoStream);
router.get('/video/transcode', videoTranscoding);
