import React from "react";
import TabButtons from "./TabButtons";
import { tabButtonArray } from "../utils";
import { ProfileBadge } from "./PageComponent/HomePageComp";

const TabComponent = (): React.JSX.Element => {
    return (
        <aside className="side-tab-container bg-surface_1 fixed bottom-0 left-0 right-0 lg:static lg:h-100vh lg:w-[15vw] lg:flex flex-col justify-between lg:px-4 lg:py-4 col-span-1 row-span-3 z-10">
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
                        <TabButtons key={val.buttonName} icon={val.buttonIcon} label={val.buttonName} path={val.path} />
                    ))}
                </div>
            </div>
            <div className="profile-badge-container hidden lg:static lg:flex flex-row items-center">
                <ProfileBadge userName="John Doe" profileImageURL="/public/profile.png" />
            </div>
        </aside>
    )
};


export default TabComponent