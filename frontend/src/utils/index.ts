import { type TabButtons } from "./interfaces";
import { Home, Clapperboard, ListMusicIcon, FolderUp, HeartPlus } from "lucide-react";


const tabButtonArray: TabButtons[] = [
    { buttonName: "Home", buttonIcon: Home },
    { buttonName: "Movies", buttonIcon: Clapperboard },
    { buttonName: "Music", buttonIcon: ListMusicIcon },
    { buttonName: "Uploads", buttonIcon: FolderUp },
    { buttonName: "Favorites", buttonIcon: HeartPlus },
];  


export {
    tabButtonArray,
}