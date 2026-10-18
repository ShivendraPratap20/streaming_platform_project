
import axios from "axios";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const execFileAsync = promisify(execFile);

export async function transcodeVideo(sourceUrl: string) {
  const workDir = await mkdtemp(
    path.join(tmpdir(), "video-transcode-")
  );

  try {
    const sourcePath = path.join(workDir, "original.mkv");

    // Download the source without buffering the entire file.
    const response = await axios.get(sourceUrl, {
      responseType: "stream",
      timeout: 0,
    });

    await pipeline(
      response.data,
      createWriteStream(sourcePath)
    );

    // Inspect source dimensions.
    const { stdout } = await execFileAsync("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "json",
      sourcePath,
    ]);

    const metadata = JSON.parse(stdout);
    const sourceHeight: number =
      metadata.streams?.[0]?.height;

    if (!sourceHeight) {
      throw new Error("Could not determine video dimensions");
    }

    // Never upscale beyond the source resolution.
    const resolutions = [360, 720, 1080].filter(
      (height) => height <= sourceHeight
    );

    if (resolutions.length === 0) {
      resolutions.push(sourceHeight);
    }

    const outputs: Array<{
      resolution: number;
      filePath: string;
    }> = [];

    for (const height of resolutions) {
      const outputPath = path.join(
        workDir,
        `${height}p.mp4`
      );

      await execFileAsync("ffmpeg", [
        "-y",
        "-i", sourcePath,
        "-map", "0:v:0",
        "-map", "0:a?",
        "-vf", `scale=-2:${height}`,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-f", "mp4",
        outputPath,
      ]);

      outputs.push({
        resolution: height,
        filePath: outputPath,
      });
    }

    return { workDir, outputs };
  } catch (error) {
    await rm(workDir, { recursive: true, force: true });
    throw error;
  }
}