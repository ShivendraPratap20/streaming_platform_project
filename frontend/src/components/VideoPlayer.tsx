
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import PlaybackControls from "./VideoPlayer/PlaybackControls/PlaybackControls";
import { type TimeRange, type QualityLevel } from "../utils/interfaces/index";
import { updateBufferedRanges } from "../utils/index";
import ProgressBar from "./VideoPlayer/ProgressBar/ProgressBar";
import QualitySelector from "./VideoPlayer/PlaybackControls/QualitySelector";

interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;

    onPlay?: () => void;
    onPause?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
    onDurationChange?: (duration: number) => void;
    onError?: (message: string) => void;
}

const VideoPlayer = ({
    src,
    poster,
    autoPlay = false,
    loop = false,
    muted = false,
    onError,
}: VideoPlayerProps) => {

    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isBuffering, setIsBuffering] = useState(false);
    const [bufferedRanges, setBufferedRanges] = useState<TimeRange[]>([]);

    const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
    const [selectedQuality, setSelectedQuality] = useState(-1);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || !src) return;

        let active = true;

        setError(null);
        setIsBuffering(true);

        const handleHlsError = (
            _event: string,
            data: Hls.ErrorData
        ) => {
            if (!active || !data.fatal) return;

            switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    console.warn("Fatal HLS network error. Retrying...");
                    hlsRef.current?.startLoad();
                    break;

                case Hls.ErrorTypes.MEDIA_ERROR:
                    console.warn("Fatal HLS media error. Recovering...");
                    hlsRef.current?.recoverMediaError();
                    break;

                default:
                    console.error("Unrecoverable HLS error:", data);
                    setError("Unable to play this video.");
                    hlsRef.current?.destroy();
                    hlsRef.current = null;
                    break;
            }
        };

        if (Hls.isSupported()) {
            const hls = new Hls();

            hlsRef.current = hls;

            hls.on(Hls.Events.ERROR, handleHlsError);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (!active) return;

                const availableLevels: QualityLevel[] = hls.levels.map(
                    (level, index) => ({
                        index,
                        height: level.height,
                        bitrate: level.bitrate,
                    })
                );

                setQualityLevels(availableLevels);
                setSelectedQuality(-1);
                if (autoPlay) {
                    video.play().catch((err) => {
                        console.warn("Autoplay was prevented:", err);
                    });
                }
            });

            hls.attachMedia(video);
            hls.loadSource(src);

        } else if (
            video.canPlayType("application/vnd.apple.mpegurl")
        ) {
            // Native HLS support (Safari)
            video.src = src;

        } else {
            setError("Your browser does not support HLS playback.");
        }

        return () => {
            active = false;

            hlsRef.current?.destroy();
            hlsRef.current = null;

            video.pause();
            video.removeAttribute("src");
            video.load();
        };

    }, [src, autoPlay]);

    const handleTogglePlayback = async () => {
        const video = videoRef.current;

        if (!video) return;

        if (video.paused) {
            try {
                await video.play();
            } catch (error) {
                console.error("Playback failed:", error);
            }
        } else {
            video.pause();
        }
    };

    const handleSeek = (time: number) => {
        const video = videoRef.current;

        if (!video) return;

        video.currentTime = time;
    };

    const handleQualityChange = (level: number) => {
        const hls = hlsRef.current;

        if (!hls) return;

        hls.currentLevel = level;

        setSelectedQuality(level);
    };

    const handleVideoError = () => {
        const video = videoRef.current;

        if (!video || video.error === null) return;

        const message = "An error occurred while loading the video.";

        setError(message);
        onError?.(message);
    };

    return (
        <div
            className={`
                relative isolate
                w-full min-w-0
                aspect-video
                overflow-hidden
                rounded-xl
                bg-black
                group
            `}
        >
            {/* Video Layer */}
            <video
                ref={videoRef}
                poster={poster}
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                playsInline
                controls={false}
                onPlay={() => setIsPlaying(true)}

                onPause={() => setIsPlaying(false)}

                onTimeUpdate={(event) => {
                    setCurrentTime(event.currentTarget.currentTime);
                }}

                onProgress={(event) => {
                    updateBufferedRanges(event.currentTarget, setBufferedRanges);
                }}
                onLoadedMetadata={(event) => {
                    updateBufferedRanges(event.currentTarget, setBufferedRanges);
                }}
                onDurationChange={(event) => {
                    updateBufferedRanges(event.currentTarget, setBufferedRanges);
                    setDuration(event.currentTarget.duration);
                }}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onCanPlay={() => setIsBuffering(false)}
                onError={handleVideoError}
                className="
                    absolute inset-0
                    w-full h-full
                    object-cover
                    bg-black
                "
            />

            {/* Controls Overlay */}
            {!error && (
                <div
                    className="
                        absolute inset-0 z-10
                        flex flex-col
                        justify-end
                        bg-gradient-to-t
                        from-black/70
                        via-transparent
                        to-transparent
                        opacity-100
                        md:opacity-0
                        md:group-hover:opacity-100
                        md:group-focus-within:opacity-100
                        transition-opacity duration-300
                        px-3 pb-3 sm:px-4 sm:pb-4
                    "
                    onClick={() => {
                        handleTogglePlayback();
                    }}
                >
                    <div className="flex items-center justify-between">
                        <PlaybackControls
                            isPlaying={isPlaying}
                            currentTime={currentTime}
                            duration={duration}
                            onTogglePlayBack={handleTogglePlayback}
                        />

                        <QualitySelector
                            levels={qualityLevels}
                            selectedLevel={selectedQuality}
                            onSelect={handleQualityChange}
                        />
                    </div>


                    {/* Progress Bar */}
                    <div className="w-full">
                        <ProgressBar
                            currentTime={currentTime}
                            duration={duration}
                            bufferedRanges={bufferedRanges}
                            onSeek={handleSeek}
                        />
                    </div>
                </div>
            )}

            {/* Buffering */}
            {isBuffering && !error && (
                <div className="
                    absolute inset-0 z-20
                    flex items-center justify-center
                    pointer-events-none
                ">
                    <div className="
                        rounded-full
                        bg-black/50
                        p-3 sm:p-4
                    ">
                        <div className="
                            h-6 w-6 sm:h-8 sm:w-8
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                        " />
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="
                    absolute inset-0 z-30
                    flex items-center justify-center
                    bg-black/80
                    p-4
                ">
                    <p className="
                        text-center
                        text-sm sm:text-base
                        text-white
                    ">
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
