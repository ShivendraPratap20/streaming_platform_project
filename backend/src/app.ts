import express, { Request, Response } from "express";
import path from "node:path";
import cors from "cors";
import { router } from './routes/video.routes.js';

const app = express();

const PORT: number = Number(process.env.PORT) || 8000;

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'https://reactusermngapp.vercel.app'],
    credentials: true
}));

app.use(
    "/hls",
    express.static('/home/cvendra/hls-output/')
);

app.use('/api/v1', router);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello" });
})

app.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
})
