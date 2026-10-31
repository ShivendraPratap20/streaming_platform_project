import React from "react";
import { type LucideIcon } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHook";
import { setActiveTab } from "../redux/slice/slice";

interface ButtonProps{
    icon: LucideIcon,
    label: string
}

const TabButtons = ({ icon: Icon, label }: ButtonProps):React.JSX.Element => {
    const dispatch = useAppDispatch();
    const activeTab = useAppSelector(
        (state) => state.tabs.activeTab
    );

    return(
        <button className="tab-button flex flex-col lg:flex-row gap-x-5 gap-y-2 justify-center lg:justify-start items-center px-2 py-2 lg:px-4 lg:py-4"
        onClick={()=>{
            dispatch(setActiveTab(label));
        }}
        >
            <Icon size={35} color="var(--color-text_label)"/>
            <p className="text-text_label text-xs lg:text-base">{label}</p>
        </button>
    )
};

export default TabButtons