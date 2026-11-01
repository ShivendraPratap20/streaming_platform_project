import { type TabButtons, type TimeRange } from "./interfaces";
import { Home, Clapperboard, ListMusicIcon, FolderUp, HeartPlus } from "lucide-react";


const tabButtonArray: TabButtons[] = [
    { buttonName: "Home", buttonIcon: Home },
    { buttonName: "Movies", buttonIcon: Clapperboard },
    { buttonName: "Music", buttonIcon: ListMusicIcon },
    { buttonName: "Uploads", buttonIcon: FolderUp },
    { buttonName: "Favorites", buttonIcon: HeartPlus },
];

const mediaDurationFormat = (duration: number): string => {
    duration = Math.floor(duration);
    const formattedDuration = `${Math.floor(duration / 60)
        .toString()
        .padStart(2, "0")}:${(duration % 60)
            .toString()
            .padStart(2, "0")}`;
    return formattedDuration
};

const formatTime = (time: number): string => {
    if (!Number.isFinite(time) || time < 0) {
        return "00:00";
    }

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    if (hours > 0) {
        return `${String(hours).padStart(2, "0")}:${mm}:${ss}`;
    }

    return `${mm}:${ss}`;
};

const updateBufferedRanges = (video: HTMLVideoElement, setBufferedRanges: React.Dispatch<React.SetStateAction<TimeRange[]>>) => {
    const ranges: TimeRange[] = [];

    for (let i = 0; i < video.buffered.length; i++) {
        ranges.push({
            start: video.buffered.start(i),
            end: video.buffered.end(i),
        });
    }

    setBufferedRanges(ranges);
};

export {
    tabButtonArray,
    mediaDurationFormat,
    formatTime,
    updateBufferedRanges,
}