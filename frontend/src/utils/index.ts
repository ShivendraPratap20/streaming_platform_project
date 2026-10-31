import { type TabButtons } from "./interfaces";
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

export {
    tabButtonArray,
    mediaDurationFormat,
}