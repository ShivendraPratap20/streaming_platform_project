import React from "react";
import { type LucideIcon } from "lucide-react";

interface ButtonProps{
    icon: LucideIcon,
    label: string
}

const TabButtons = ({ icon: Icon, label }: ButtonProps):React.JSX.Element => {
    return(
        <div className="tab-button flex flex-col gap-y-2 justify-center items-center px-2 py-2">
            <Icon size={18} color="var(--color-text_label)"/>
            <p className="text-text_label text-xs">{label}</p>
        </div>
    )
};

export default TabButtons