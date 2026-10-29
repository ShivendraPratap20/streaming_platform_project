import React from "react";
import { ChevronDown } from "lucide-react";
import TabButtons from "./TabButtons";
import { tabButtonArray } from "../utils";


const TabComponent = (): React.JSX.Element => {
    return (
        <aside className="side-tab-container bg-surface_1 absolute bottom-0 left-0 right-0 lg:static lg:h-100vh">
            <div className="side-tab-btns flex flex-row justify-between lg:flex-col ">
                {tabButtonArray.map((val) => (
                    <TabButtons key={val.buttonName} icon={val.buttonIcon} label={val.buttonName} />
                ))}
            </div>
        </aside>
    )
};


export default TabComponent