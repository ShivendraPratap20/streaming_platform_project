import Hls from "hls.js";

const handleTogglePlayback = async (audioElement: HTMLAudioElement | null) => {
    if (!audioElement)
        return

    if (audioElement.paused) {
        try {
            await audioElement.play();
        } catch (error) {
            console.error("Playback failed:", error);
        }
    } else {
        audioElement.pause();
    }
};

const handleQualityChange = (level: number, HlsElement: Hls, setSelectedQuality: any) => {
    if (!HlsElement) return;

    HlsElement.currentLevel = level;
    setSelectedQuality(level)
};

const handleSeek = (MediaElement: HTMLVideoElement | HTMLAudioElement | null, time: number) => {
    
    if (!MediaElement) return;

    MediaElement.currentTime = time;
};

export {
    handleTogglePlayback,
    handleQualityChange,
    handleSeek,
}