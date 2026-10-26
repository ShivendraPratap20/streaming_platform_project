import React from "react";
import { type LucideIcon } from "lucide-react";

interface ButtonProps{
    icon: LucideIcon,
    label: string
}

const TabButtons = ({ icon: Icon, label }: ButtonProps):React.JSX.Element => {
    return(
        <div className="tab-button flex flex-row gap-x-2 justify-start items-center px-2 py-4">
            <Icon size={28}/>
            <p>{label}</p>
        </div>
    )
};

export default TabButtons