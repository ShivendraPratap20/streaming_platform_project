import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import PlaybackControls from "./PlaybackControls";
import QualitySelector from "./QualitySelector";
import { updateBufferedRanges } from "../../utils";
import { type QualityLevel, type TimeRange } from "../../utils/interfaces";
import ProgressBar from "./ProgressBar";

const AudioPlayer = ({ src }: { src: string }): React.JSX.Element => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const hslRef = useRef<Hls | null>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
    const [selectedQuality, setSelectedQuality] = useState(-1);

    const [isBuffering, setIsBuffering] = useState(false);
    const [bufferedRanges, setBufferedRanges] = useState<TimeRange[]>([]);


    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (!audioElement || !src) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hslRef.current = hls;

            hls.on(Hls.Events.ERROR, (_event: string, data: Hls.ErrorData) => {

            })
            hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
                console.log(hls.levels)
                const availableLevels: QualityLevel[] = hls.levels.map(
                    (level, index) => ({
                        index,
                        height: level.height,
                        bitrate: level.bitrate,
                    })
                );

                setQualityLevels(availableLevels);
                setSelectedQuality(-1);
            });

            hls.attachMedia(audioElement);
            hls.loadSource(src);

        } else if (audioElement.canPlayType("application/vnd.apple.mpegurl")) {
            audioElement.src = src;
        } else {
            setError('Your browser does not supported HLS playback');
        }

        return () => {
            hslRef.current?.destroy();
            hslRef.current = null;

            audioElement.pause();
            audioElement.removeAttribute("src");
            audioElement.load();
        };
    }, [src]);

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
            `}>
            <audio
                ref={audioRef}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(event) => {
                    setCurrentTime(event.currentTarget.currentTime)
                }}
                onDurationChange={(event) => {
                    updateBufferedRanges(event.currentTarget, setBufferedRanges);
                    setDuration(event.currentTarget.duration);
                }}
                onProgress={(event) => {
                    updateBufferedRanges(event.currentTarget, setBufferedRanges);
                    console.log(event.currentTarget.buffered.start(0))
                }}
                onLoadedMetadata={(event) => {
                    updateBufferedRanges(event.currentTarget, setBufferedRanges);
                }}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onCanPlay={() => setIsBuffering(false)}
            />
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
                >
                    <div className="flex items-center justify-between">
                        <PlaybackControls
                            isPlaying={isPlaying}
                            mediaElement={audioRef.current}
                            currentTime={currentTime}
                            duration={duration}
                        />

                        <QualitySelector
                            levels={qualityLevels}
                            selectedLevel={selectedQuality}
                            setSelectedQuality={selectedQuality}
                            HlsElement={hslRef.current}
                        />
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full">
                        <ProgressBar
                            MediaElement={audioRef.current}
                            currentTime={currentTime}
                            duration={duration}
                            bufferedRanges={bufferedRanges}
                            onSeek={()=>{}}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioPlayer;