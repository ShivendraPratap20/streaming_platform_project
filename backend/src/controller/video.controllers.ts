import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { Request, Response } from "express";
import { parseRange } from "../utils/index.js";
import { AppError } from "../utils/AppError.js";

export const videoStream = async (req: Request, res: Response) => {
    try {
        const rangeHeader = req.headers.range;
        const videoPath: string = '/home/cvendra/Downloads/RE2012.mkv';
        const fileInfo = await stat(videoPath);


        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Type", "video/mkv");
        res.setHeader("Cache-Control", "no-transform");
        if (req.method === "HEAD") {
            res.status(200);
            res.setHeader("Content-Length", fileInfo.size);
            res.end();
            return;
        }
        if (!rangeHeader) {
            res.status(200);
            res.setHeader("Content-Length", fileInfo.size);

            try {
                await pipeline(createReadStream(videoPath), res);
            } catch (error) {
                if (!res.destroyed) {
                    res.destroy(error as Error);
                }
            }

            return;
        }

        const range = parseRange(rangeHeader, fileInfo.size);

        if (!range) {
            res.status(416);
            res.setHeader("Content-Range", `bytes */${fileInfo.size}`);
            res.end();
            return;
        }

        const { start, end } = range;
        const chunkSize = end - start + 1;

        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${fileInfo.size}`);
        res.setHeader("Content-Length", chunkSize);

        try {
            await pipeline(
                createReadStream(videoPath, { start, end }),
                res
            );
        } catch (error) {
            if (!res.destroyed) {
                res.destroy(error as Error);
            }
        }

    } catch (error) {

    }
}
