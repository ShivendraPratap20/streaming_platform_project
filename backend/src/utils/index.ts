import { spawn } from "node:child_process";


type ByteRange = {
    start: number,
    end: number
};

type VideoDataType = {
    name: string,
    id:number,
    transcodingStatus: string,
    path: string,
    hlsPath?:string
};

const dummyVideoData: VideoDataType = {
    name: 'cplotus3',
    id: 12,
    transcodingStatus: 'initial',
    path: '/home/cvendra/Videos/cplotus3.mkv'
}

function parseRange(
    rangeHeader: string,
    fileSize: number
): ByteRange | null {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());

    if (!match || fileSize === 0) {
        return null;
    }

    const [, startText, endText] = match;

    let start: number;
    let end: number;

    if (startText === "" && endText === "") {
        return null;
    }

    if (startText === "") {
        const suffixLength = Number(endText);

        if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
            return null;
        }

        start = Math.max(0, fileSize - suffixLength);
        end = fileSize - 1;
    } else {
        start = Number(startText);

        if (!Number.isSafeInteger(start) || start >= fileSize) {
            return null;
        }

        end = endText === "" ? fileSize - 1 : Number(endText);

        if (!Number.isSafeInteger(end) || end < start) {
            return null;
        }

        end = Math.min(end, fileSize - 1);
    }

    return { start, end };
}

function runFFmpeg(args: string[]) {
    return new Promise((resolve, reject) => {
        const process = spawn("ffmpeg", args);

        let stderr = "";

        process.stderr.on("data", (chunk) => {
            stderr += chunk.toString();

            // Keep the error buffer bounded.
            if (stderr.length > 20000) {
                stderr = stderr.slice(-20000);
            }
        });

        process.on("error", reject);

        process.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(
                    new Error(`FFmpeg exited with code ${code}: ${stderr}`)
                );
            }
        });
    });
}

export {
    parseRange,
    runFFmpeg,
    dummyVideoData
}