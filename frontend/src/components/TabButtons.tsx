import React from "react";
import { type LucideIcon } from "lucide-react";

interface ButtonProps{
    icon: LucideIcon,
    label: string
}

const TabButtons = ({ icon: Icon, label }: ButtonProps):React.JSX.Element => {
    return(
        <div className="tab-button flex flex-col lg:flex-row gap-x-5 gap-y-2 justify-center lg:justify-start items-center px-2 py-2 lg:px-4 lg:py-4">
            <Icon size={35} color="var(--color-text_label)"/>
            <p className="text-text_label text-xs lg:text-base">{label}</p>
        </div>
    )
};

export default TabButtons