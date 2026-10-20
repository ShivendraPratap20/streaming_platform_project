import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs/promises";
import path from "node:path";
import { hlsDir } from "../constants/index.js";

const HLS_ROOT: string = path.resolve(hlsDir);

export async function createHLSAudio(
    audioID: string,
    audioCloudinaryURL: string,
    outputDir: string = HLS_ROOT
) {
    const audioDir = path.join(outputDir, audioID);

    await fs.mkdir(audioDir, { recursive: true });

    const variants = [
        { bitrate: 96, name: "96kbps" },
        { bitrate: 160, name: "160kbps" },
        { bitrate: 256, name: "256kbps" },
    ];

    await Promise.all(
        variants.map(
            ({ bitrate, name }) =>
                new Promise<void>((resolve, reject) => {
                    const variantDir = path.join(audioDir, name);

                    fs.mkdir(variantDir, { recursive: true })
                        .then(() => {
                            ffmpeg(audioCloudinaryURL)
                                .noVideo()
                                .audioCodec("aac")
                                .audioBitrate(bitrate)
                                .outputOptions([
                                    "-f hls",
                                    "-hls_time 6",
                                    "-hls_playlist_type vod",
                                    "-hls_segment_filename",
                                    path.join(variantDir, "segment_%03d.ts"),
                                ])
                                .output(path.join(variantDir, "index.m3u8"))
                                .on("end", () => resolve())
                                .on("error", reject)
                                .run();
                        })
                        .catch(reject);
                })
        )
    );

    // Generate the master playlist.
    const masterPlaylist = [
        "#EXTM3U",
        "#EXT-X-VERSION:3",
        "#EXT-X-STREAM-INF:BANDWIDTH=110000,CODECS=\"mp4a.40.2\"",
        "96kbps/index.m3u8",
        "#EXT-X-STREAM-INF:BANDWIDTH=180000,CODECS=\"mp4a.40.2\"",
        "160kbps/index.m3u8",
        "#EXT-X-STREAM-INF:BANDWIDTH=290000,CODECS=\"mp4a.40.2\"",
        "256kbps/index.m3u8",
        "",
    ].join("\n");

    const masterPath = path.join(audioDir, "master.m3u8");

    await fs.writeFile(masterPath, masterPlaylist, "utf8");

    return {
        outputDir: audioDir,
        masterPlaylistPath: "master.m3u8",
        variants: variants.map((variant, index) => ({
            resolution: variant.bitrate,
            playlistPath: path.join(`v${index}`, "index.m3u8"),
        })),
    };
}