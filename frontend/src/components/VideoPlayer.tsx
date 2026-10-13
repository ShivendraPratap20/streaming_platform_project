import { useEffect, useRef } from "react";
import Hls from "hls.js";


interface VidePlayerProps {
    src: string,
    poster?: string,
    controls?: boolean,
    autoPlay?: boolean,
    loop?: boolean,
    muted?: boolean
};


const VideoPlayer = ({
    src,
    poster,
    controls = true,
    autoPlay = false,
    loop = false,
    muted = false,
}: VidePlayerProps) => {
    const videoPlayerRef = useRef<HTMLMediaElement>(null);

    useEffect(() => {
        const videoPlayer = videoPlayerRef.current;

        if (Hls.isSupported()) {
            const hls = new Hls();

            hls.loadSource(src);
            hls.attachMedia(videoPlayer);

            return () => hls.destroy();
        }
        if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
            videoPlayer.src = src;
        }
    }, []);

    return (
        <video
            src={src}
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            style={{
                width: "100%",
                maxWidth: "800px",
                borderRadius: "12px",
            }}
        >
            Your browser does not support HTML video.
        </video>
    );
};


export default VideoPlayer;