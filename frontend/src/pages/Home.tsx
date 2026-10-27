import React from "react";
import { useNavigate } from "react-router";
import { ChevronDown, Bell, Dot } from "lucide-react";
import TabComponent from '../components/TabComponent';

export default function Home(): React.JSX.Element {
    const navigate = useNavigate();
    const videoID: string = "6ad6369a084f9bc3ceb9f97b";
    const onClickHandler = () => {
        navigate(`/player/${videoID}`);
    }

    return <div className="bg-page_bg grid grid-cols-7 gap-x-6">
        <div className="bg-blue-100 col-span-1">
            <TabComponent />
        </div>
        <main className="col-span-6">
            <nav className="flex justify-end px-4 py-4 items-center gap-x-4">
                 <div className="notification relative rounded-4xl bg-surface_1 p-4">
                    <Bell size={35} color="var(--color-text_label)"/>
                    <Dot size={40} color="var(--color-error)" className="absolute top-0 right-0"/>
                </div>
                <div className="user-info flex flex-row justify-between items-center p-2 rounded-4xl bg-surface_1 shadow-xl/30">
                    <div className="user-info-pic-text flex flex-row gap-x-2 items-center">
                        <img src="/profile.png" alt="Cvendra's profile" width={55} height={55} className="rounded-full" />
                        <p className="user-info-text text-text_label">Cvendra</p>
                    </div>
                    <ChevronDown size={28} color="var(--color-text_label)" />
                </div>
            </nav>
        </main>
    </div>
}