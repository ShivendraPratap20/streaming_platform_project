
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