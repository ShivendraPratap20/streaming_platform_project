import express from 'express';
import { videoStream } from '../controller/video.controllers.js';


export const router = express.Router();


router.get('/video', videoStream);
