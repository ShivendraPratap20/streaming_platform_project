import React from "react";
import { NavLink } from "react-router";
import { type LucideIcon } from "lucide-react";

interface ButtonProps{
    icon: LucideIcon,
    label: string,
    path: string,
}

const TabButtons = ({ icon: Icon, label, path }: ButtonProps):React.JSX.Element => {

    return(
        <NavLink
            to={path}
            className={({ isActive }) =>
                `tab-button flex flex-col lg:flex-row gap-x-5 gap-y-2 justify-center lg:justify-start items-center px-2 py-2 lg:px-4 lg:py-4 
            rounded-3xl
            ${isActive ? "bg-linear-to-b from-gradient_1 to-gradient_2 text-text_primary" : "text-text_label"}
            hover:bg-container  
            `
            }
        >
            <Icon size={30} color="var(--color-text_label)"/>
            <p className="text-text_label text-xs lg:text-base">{label}</p>
        </NavLink>
    )
};

export default TabButtons