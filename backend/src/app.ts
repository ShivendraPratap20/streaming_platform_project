import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/database/connection.js";
import { router } from './routes/video.routes.js';
import { redisConnect } from './config/redis.config.js';
import mediaRouter from "./routes/media.routes.js";
import errorHandler, { notFound } from "./middleware/error.middleware.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const PORT: number = Number(process.env.PORT) || 8000;

app.use(express.json());

await connectDB();
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
app.use('/api/v1/user', userRouter);   

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
})
