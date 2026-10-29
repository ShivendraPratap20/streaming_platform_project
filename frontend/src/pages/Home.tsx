import React from "react";
import { useNavigate } from "react-router";
import { ChevronDown, Bell, Dot } from "lucide-react";
import TabComponent from '../components/TabComponent';
import Banner from "../components/Banner";

export default function Home(): React.JSX.Element {
    const navigate = useNavigate();

    return <div className="bg-page_bg lg:flex flex-row">
        <TabComponent />
        <main className="flex flex-col gap-y-5 px-4 py-4">
            <nav className="flex flex-row justify-end items-center gap-x-2">
                <div className="bg-container rounded-4xl px-2 py-2">
                    <Bell size={22} color="var(--color-text_label)"/>
                </div>
                <div className="user-info flex flex-row justify-between items-center p-2 rounded-4xl bg-container">
                    <div className="user-info-pic-text flex flex-row gap-x-2 items-center">
                        <img src="/profile.png" alt="Cvendra's profile" width={20} height={20} className="rounded-full" />
                        <p className="user-info-text text-text_label text-sm">Cvendra</p>
                    </div>
                    <ChevronDown size={28} color="var(--color-text_label)" />
                </div>
            </nav>
            
            <Banner/>
            
        </main>
    </div>
}