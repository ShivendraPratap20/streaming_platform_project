import React from "react"
import { useLocation } from "react-router";
import { MonitorPlay, EighthNote, Plus, Heart } from "lucide-react";
import { type MediaDataType } from "../utils/interfaces";
import { mediaDurationFormat } from "../utils";
import VideoPlayer from "../components/VideoPlayer";
import AudioPlayer from "../components/AudioPlayerComponent";
import Button from "../components/Button";

export default function VideoPlayerPage(): React.JSX.Element {
    let { state } = useLocation();
    const { _id, mediaName, mediaType, hlsURL, createdAt, mediaDetails: { duration }, artist: { artistName }, aboutMediaInfo }: MediaDataType = state.Media;

    if (!state.Media)
        return <h1>Loading....</h1>

    return (
        <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:grid-rows-[1fr_1fr] gap-4">
            {
                mediaType == "video" ? (
                    <VideoPlayer src={hlsURL + '/master.m3u8' || ''} />
                ) : (
                    <AudioPlayer src={hlsURL + '/master.m3u8' || ''} />
                )
            }

            <section className="flex flex-col gap-4 lg:row-start-2 ">
                <section className="media_info_section flex flex-col gap-3">
                    <p className="text-2xl text-text_primary">{mediaName}</p>
                    <div className="flex flex-row justify-start gap-4 items-center">
                        <div className="flex flex-row justify-center gap-2 items-center">
                            <div className="rounded-4xl p-2 bg-custom_purple">
                                {
                                    mediaType == 'video' ? <MonitorPlay color="var(--color-text_label)" size={30} /> : <EighthNote color="var(--color-text_label)" size={30} />
                                }
                            </div>
                            <p className="text-text_label">{mediaType}</p>
                        </div>
                        <p className="text-text_label">{new Date(createdAt).getFullYear()}</p>
                        <p className="text-text_label">{mediaDurationFormat(duration)}</p>
                    </div>
                    <p className="text-lg text-text_label">{aboutMediaInfo}</p>
                    <div className="flex flex-row justify-start items-center gap-4">
                        <Button icon={Plus} Title={'Add to Playlist'} mediaID={_id} buttonTag="FavBtn"/>
                        <Button icon={Heart} Title={'Add to Favorite'}  mediaID={_id} buttonTag="PlyLstBtn"/>

                    </div>
                </section>

                <section className="artist_info_section bg-dark_blue flex flex-row gap-x-5 items-start p-4 rounded-2xl">
                    <img src="/profile.png" alt={`${artistName}'s profile`} width={70} height={70} className="rounded-full" />
                    <div className="info flex flex-col gap-y-2">
                        <div>
                            <p className="text-text_primary text-xl">{artistName}</p>
                            <p className="text-text_label text-sm">Director Creator Writer</p>
                        </div>
                        <p className="text-text_label ">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde architecto nesciunt quam voluptate officiis, reiciendis corporis dignissimos rerum deleniti. Dolore, iusto laborum. Veniam voluptatum pariatur incidunt et tempore, suscipit consequuntur!</p>
                    </div>
                </section>
            </section>
        </div>)
}