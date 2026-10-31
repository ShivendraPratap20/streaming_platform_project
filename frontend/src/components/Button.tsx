import React from "react";
import { type LucideIcon } from "lucide-react";

const Button = ({ icon: Icon, Title }: { icon: LucideIcon, Title: string }): React.JSX.Element => {
    return (
        <button className="flex sm:flex-row flex-col justify-start items-center gap-2 bg-dark_blue p-3 rounded-2xl">
            <Icon size={35} color="var(--color-text_label)" />
            <p className="text-lg text-text_label">{Title}</p>
        </button>
    )
};

export default Button; 