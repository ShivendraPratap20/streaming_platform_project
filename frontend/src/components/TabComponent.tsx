import React from "react";
import { ChevronDown } from "lucide-react";
import TabButtons from "./TabButtons";
import { tabButtonArray } from "../utils";


const TabComponent = (): React.JSX.Element => {
    return (
        <aside className="side-tab-container hidden md:flex flex-col justify-between shrink-0 max-w-xs h-dvh bg-surface_1 px-4 py-4">
            <div className="flex flex-col gap-2 min-h-0">
                <div className="logo-container flex flex-row gap-x-4 justify-center items-center">
                    <img src="/streamvibe-logo.png" alt="StreamVibe logo" width={50} height={50} />
                    <div className="logo-text">
                        <h2 className="logo-head text-center text-white">StreamVibe</h2>
                        <p className="logo-para text-center text-white">Video + Audio Stream</p>
                    </div>
                </div>

                <div className="side-tab-btns overflow-y-auto">
                    {tabButtonArray.map((val) => (
                        <TabButtons key={val.buttonName} icon={val.buttonIcon} label={val.buttonName} />
                    ))}
                </div>
            </div>

            <div className="user-info flex flex-row justify-between items-center p-2 rounded-4xl bg-container">
                <div className="user-info-pic-text flex flex-row gap-x-2 items-center">
                    <img src="/profile.png" alt="Cvendra's profile" width={55} height={55} className="rounded-full" />
                    <p className="user-info-text text-text_label">Cvendra</p>
                </div>
                <ChevronDown size={28} color="var(--color-text_label)"/>
            </div>
        </aside>
    )
};


export default TabComponent