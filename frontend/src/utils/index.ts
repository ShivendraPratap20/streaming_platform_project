import { type TabButtons, type TimeRange } from "./interfaces";
import { Home, Clapperboard, ListMusicIcon, FolderUp, HeartPlus } from "lucide-react";


const tabButtonArray: TabButtons[] = [
    { buttonName: "Home", buttonIcon: Home, path: "/" },
    { buttonName: "Movies", buttonIcon: Clapperboard, path: "/movies" },
    { buttonName: "Music", buttonIcon: ListMusicIcon, path: "/music" },
    { buttonName: "Uploads", buttonIcon: FolderUp, path: "/uploads" },
    { buttonName: "Favorites", buttonIcon: HeartPlus, path: "/favorites" },
];

type FileSizeUnit = "B" | "KB" | "MB" | "GB";

interface FormattedFileSize {
    value: number;
    unit: FileSizeUnit;
}

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

const updateBufferedRanges = (video: HTMLVideoElement | HTMLAudioElement, setBufferedRanges: React.Dispatch<React.SetStateAction<TimeRange[]>>) => {
    const ranges: TimeRange[] = [];

    for (let i = 0; i < video.buffered.length; i++) {
        ranges.push({
            start: video.buffered.start(i),
            end: video.buffered.end(i),
        });
    }

    setBufferedRanges(ranges);
};

const fileSizeFormat = (bytes: number): FormattedFileSize => {
    if (!Number.isFinite(bytes) || bytes < 0) {
        throw new RangeError("bytes must be a non-negative finite number");
    }

    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;

    const round = (n: number) => Number(n.toFixed(2));

    if (bytes >= GB) return { value: round(bytes / GB), unit: "GB" };
    if (bytes >= MB) return { value: round(bytes / MB), unit: "MB" };
    if (bytes >= KB) return { value: round(bytes / KB), unit: "KB" };
    return { value: bytes, unit: "B" };
};

export {
    tabButtonArray,
    mediaDurationFormat,
    formatTime,
    updateBufferedRanges,
    fileSizeFormat
}