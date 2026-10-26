import React from "react";
import { ChevronDown } from "lucide-react";
import TabButtons from "./TabButtons";
import { tabButtonArray } from "../utils";


const TabComponent = (): React.JSX.Element => {
    return (
        <div className="side-tab-container flex flex-col justify-between bg-blue-300 w-70 h-screen px-4 py-4">

            <div className="flex flex-col gap-2">

                <div className="logo-container flex flex-row gap-x-4 justify-center items-center ">
                    <div className="logo-icon">
                        <img src="/public/streamvibe-logo.png" alt="" width={50} height={50}/>
                    </div>
                    <div className="logo-text">
                        <h4 className="logo-head text-center">StreamVibe</h4>
                        <p className="logo-para text-center">Video + Audio Stream</p>
                    </div>
                </div>
                <div className="side-tab-btns">
                    {
                        tabButtonArray.map((val, idx) => {
                            return <TabButtons key={idx} icon={val.buttonIcon} label={val.buttonName}/>
                        })
                    }
                </div>

            </div>

            <div className="user-info flex flex-row justify-between items-center p-2 rounded-4xl">
                <div className="user-info-pic-text flex flex-row gap-x-2 items-center">
                    <div>
                        <img src="/public/profile.png" alt="" width={55} height={55} className="rounded-full"/>
                    </div>
                    <p className="user-info-text">Cvendra</p>
                </div>
                <ChevronDown size={28}/>
            </div>

        </div>
    )
};


export default TabComponent