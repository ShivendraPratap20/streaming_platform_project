
import axios from "axios";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createWriteStream } from "node:fs";
import {
  mkdir,
  mkdtemp,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { pipeline } from "node:stream/promises";
import { hlsDir } from "../constants/index.js";

const execFileAsync = promisify(execFile);

const TARGET_RESOLUTIONS = [360, 460, 720, 1080];
const HLS_ROOT = path.resolve(hlsDir);


const VIDEO_BITRATES: Record<number, string> = {
  360: "800k",
  460: "1200k",
  720: "2800k",
  1080: "5000k",
};

type VideoStream = {
  codec_type: string;
  width?: number;
  height?: number;
};

export async function createHls(
  videoID: string, 
  cloudinaryUrl: string,
  outputRoot = HLS_ROOT
) {
  let outputDir: string | undefined;

  try {
    // 1. Validate the source URL.
    const parsedUrl = new URL(cloudinaryUrl);

    if (
      parsedUrl.protocol !== "http:" ||
      !(
        parsedUrl.hostname === "res.cloudinary.com" ||
        parsedUrl.hostname.endsWith(".cloudinary.com")
      )
    ) {
      throw new Error("Expected a valid Cloudinary HTTPS URL");
    }

    // 2. Create a persistent output directory.
    await mkdir(outputRoot, { recursive: true });

    outputDir = await mkdtemp(
      path.join(outputRoot, videoID)
    );

    const sourcePath = path.join(outputDir, "source.bin");

    // 3. Download the original video as a stream.
    const response = await axios.get(cloudinaryUrl, {
      responseType: "stream",
      timeout: 300_000,
      maxRedirects: 5,
    });

    await pipeline(
      response.data,
      createWriteStream(sourcePath)
    );

    // 4. Inspect the source video and audio streams.
    const { stdout } = await execFileAsync("ffprobe", [
      "-v", "error",
      "-show_entries", "stream=codec_type,width,height",
      "-of", "json",
      sourcePath,
    ]);

    const probe = JSON.parse(stdout);
    const streams: VideoStream[] = probe.streams ?? [];

    const videoStream = streams.find(
      (stream) => stream.codec_type === "video"
    );

    if (!videoStream?.height || !videoStream.width) {
      throw new Error("Source has no readable video stream");
    }

    const sourceHeight = videoStream.height;
    const hasAudio = streams.some(
      (stream) => stream.codec_type === "audio"
    );

    // Never upscale the source.
    const resolutions = TARGET_RESOLUTIONS.filter(
      (height) => height <= sourceHeight
    );

    // If the source is smaller than 360p, preserve its
    // approximate native height instead of upscaling it.
    if (resolutions.length === 0) {
      resolutions.push(Math.max(2, Math.floor(sourceHeight / 2) * 2));
    }

    // 5. Create one directory per rendition.
    for (let i = 0; i < resolutions.length; i++) {
      await mkdir(path.join(outputDir, `v${i}`));
    }

    // 6. Construct a single FFmpeg filter graph.
    const splitOutputs = resolutions
      .map((_, i) => `[source${i}]`)
      .join("");

    const scaleFilters = resolutions
      .map(
        (height, i) =>
          `[source${i}]scale=-2:${height}[video${i}]`
      )
      .join(";");

    const filterComplex =
      `[0:v:0]split=${resolutions.length}${splitOutputs};` +
      scaleFilters;

    const args: string[] = [
      "-y",
      "-i", sourcePath,
      "-filter_complex", filterComplex,
    ];

    // Map each rendition and, if present, its audio stream.
    resolutions.forEach((_, i) => {
      args.push("-map", `[video${i}]`);

      if (hasAudio) {
        args.push("-map", "0:a:0");
      }
    });

    // 7. Configure video and audio encoding.
    args.push(
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac"
    );

    resolutions.forEach((height, i) => {
      const bitrate =
        VIDEO_BITRATES[height] ??
        (height <= 360 ? "800k" : "1200k");

      args.push(
        `-b:v:${i}`, bitrate,
        `-maxrate:v:${i}`, bitrate,
        `-bufsize:v:${i}`, bitrate
      );

      // Force aligned keyframes every six seconds.
      args.push(
        `-force_key_frames:v:${i}`,
        "expr:gte(t,n_forced*6)"
      );
    });

    if (hasAudio) {
      resolutions.forEach((_, i) => {
        args.push(`-b:a:${i}`, "128k");
      });
    }

    // 8. Describe how output streams form HLS variants.
    const variantMap = resolutions
      .map((_, i) =>
        hasAudio ? `v:${i},a:${i}` : `v:${i}`
      )
      .join(" ");

    const segmentPattern = path.join(
      outputDir,
      "v%v",
      "segment_%05d.ts"
    );

    const mediaPlaylistPattern = path.join(
      outputDir,
      "v%v",
      "index.m3u8"
    );

    args.push(
      "-var_stream_map", variantMap,
      "-master_pl_name", "master.m3u8",
      "-hls_time", "6",
      "-hls_list_size", "0",
      "-hls_playlist_type", "vod",
      "-hls_flags", "independent_segments+temp_file",
      "-hls_segment_filename", segmentPattern,
      "-f", "hls",
      mediaPlaylistPattern
    );

    // 9. Execute FFmpeg.
    await execFileAsync("ffmpeg", args, {
      maxBuffer: 20 * 1024 * 1024,
    });

    // 10. Remove the original download, keeping HLS outputs.
    await rm(sourcePath, { force: true });

    return {
      outputDir,
      masterPlaylistPath: path.join(
        "master.m3u8"
      ),
      variants: resolutions.map((resolution, index) => ({
        resolution,
        playlistPath: path.join(
          `v${index}`,
          "index.m3u8"
        ),
      })),
    };
  } catch (error) {
    // Do not leave a partial HLS package behind.
    if (outputDir) {
      await rm(outputDir, {
        recursive: true,
        force: true,
      });
    }

    throw error;
  }
}
