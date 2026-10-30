import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Bell } from "lucide-react";
import TabComponent from '../components/TabComponent';
import Banner from "../components/Banner";
import api from "../api/axios";
import MediaCardContainer from "../components/MediaCardContainer";

export default function Home(): React.JSX.Element {
    const { isSuccess, data } = useQuery({
        queryKey: ['trendingMediaData'],
        queryFn: async () => {
            const data = await api.get('/media/trending');
            return data;
        }
    });


    return <div className="bg-page_bg lg:flex flex-row h-[100vh] md:w-[100vw]">
        <main className="flex flex-col gap-y-5 px-4 py-4 md:w-[80vw]">
            <nav className="flex flex-row justify-end items-center gap-x-2">
                <div className="bg-container rounded-4xl px-2 py-2">
                    <Bell size={22} color="var(--color-text_label)" />
                </div>
                <div className="user-info flex flex-row justify-between items-center p-2 rounded-4xl bg-container">
                    <div className="user-info-pic-text flex flex-row gap-x-2 items-center">
                        <img src="/profile.png" alt="Cvendra's profile" width={20} height={20} className="rounded-full" />
                        <p className="user-info-text text-text_label text-sm">Cvendra</p>
                    </div>
                    <ChevronDown size={28} color="var(--color-text_label)" />
                </div>
            </nav>

            <Banner />
            {isSuccess && <MediaCardContainer
                title="Trending"
                mediaCardData={data} />
            }
        </main>
    </div>
}