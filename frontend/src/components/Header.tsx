import React from "react";
import { Bell } from "lucide-react";
import { ProfileBadge } from "./PageComponent/HomePageComp";

const Header = (): React.JSX.Element => {
    return (
        <header className="flex flex-row justify-end items-center gap-2 px-4 py-2 bg-surface_1 col-span-2 col-start-2 row-span-1">
            <div className="bg-container rounded-4xl px-2 py-2">
                <Bell size={22} color="var(--color-text_label)" />
            </div>
            <div className="flex flex-row items-center gap-2">
                <ProfileBadge userName="John Doe" profileImageURL="/public/profile.png" />
            </div>
        </header>
    )
}

export default Header;
