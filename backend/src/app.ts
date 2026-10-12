import express, { Request, Response} from "express";
import { router } from './routes/video.routes.js';

const app = express();

const PORT:number = Number(process.env.PORT) || 8000;

app.use(express.json());

app.use('/api/v1', router);

app.get("/", (req:Request, res: Response) => {
    res.json({message: "Hello"});
})

app.listen(PORT, ()=>{
    console.log(`Server is started at port ${PORT}`);
})
