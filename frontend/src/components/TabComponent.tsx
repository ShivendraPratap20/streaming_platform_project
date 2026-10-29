import React from "react";
import { ChevronDown } from "lucide-react";
import TabButtons from "./TabButtons";
import { tabButtonArray } from "../utils";


const TabComponent = (): React.JSX.Element => {
    return (
        <aside className="side-tab-container bg-surface_1 absolute bottom-0 left-0 right-0 lg:static lg:h-100vh lg:w-[20vw] lg:flex flex-col justify-between lg:px-4 lg:py-4">
            <div className="flex flex-col gap-4">
                <div className="logo-container hidden lg:flex flex-row gap-x-4 justify-center items-center ">
                    <div className="logo-icon">
                        <img src="/public/streamvibe-logo.png" alt="" width={50} height={50} />
                    </div>
                    <div className="logo-text">
                        <h4 className="logo-head text-center lg:text-2xl text-text_label">StreamVibe</h4>
                        <p className="logo-para text-center lg:text-base text-text_label">Video + Audio Stream</p>
                    </div>
                </div>
                <div className="side-tab-btns flex flex-row justify-between lg:flex-col ">
                    {tabButtonArray.map((val) => (
                        <TabButtons key={val.buttonName} icon={val.buttonIcon} label={val.buttonName} />
                    ))}
                </div>
            </div>

            <div className="user-info hidden lg:flex flex-row justify-between items-center p-2 rounded-4xl bg-container">
                <div className="user-info-pic-text flex flex-row gap-x-2 items-center">
                    <img src="/profile.png" alt="Cvendra's profile" width={50} height={50} className="rounded-full" />
                    <p className="user-info-text text-text_label text-sm">Cvendra</p>
                </div>
            </div>
        </aside>
    )
};


export default TabComponent