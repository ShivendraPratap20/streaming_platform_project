import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { Request } from "express";

const congifMUlter = (uploadDir: string) => {
    fs.mkdirSync(uploadDir, { recursive: true });

    const storage = multer.diskStorage({
        destination: (req: Request, file: any, cb) => {
            cb(null, uploadDir)
        },
        filename: (req: Request, file: any, cb) => {
            const extension = path.extname(file.originalname).toLowerCase();
            const filename = `${randomUUID()}${extension}`;

            cb(null, filename);
        }
    });

    const fileFilter = (req: Request, file: any, cb:any) => {
        if (
            file.mimetype.startsWith("video/") ||
            file.mimetype.startsWith("audio/")
        ) {
            return cb(null, true);
        }

        cb(new Error("Only audio and video files are allowed."));
    };

    return { storage, fileFilter };
}


export default congifMUlter;