import * as dotenv from "dotenv";
dotenv.config({ path: '/home/cvendra/MERN_PROJECTS/streamingPlatform/backend/.env'});

import express, { Request, Response } from "express";
import path from "node:path";
import cors from "cors";
import "./config/database/connection.js";
import { router } from './routes/video.routes.js';
import { redisConnect}  from './config/redis.config.js';
import mediaRouter from "./routes/media.routes.js";

const app = express();

const PORT: number = Number(process.env.PORT) || 8000;

app.use(express.json());

redisConnect();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(
    "/hls",
    express.static('/home/cvendra/hls-output/')
);

//app.use('/api/v1', router);
app.use('/api/v1/media', mediaRouter);

app.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
})
