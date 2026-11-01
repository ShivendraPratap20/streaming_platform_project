import React from "react"
import { useLocation } from "react-router";
import { MonitorPlay, EighthNote, Plus, Heart } from "lucide-react";
import { type MediaDataType } from "../utils/interfaces";
import { mediaDurationFormat } from "../utils";
import VideoPlayer from "../components/VideoPlayer";
import Button from "../components/Button";

export default function VideoPlayerPage(): React.JSX.Element {
    let { state } = useLocation();
    const { mediaName, mediaType, hlsURL, createdAt, mediaDetails: { duration }, artist: { artistName } }: MediaDataType = state.Media;

    if (!state.Media)
        return <h1>Loading....</h1>

    return (
        <div className="flex flex-col gap-y-4 p-4 sm:p-6 md:p-8 lg:p-10">
            <VideoPlayer src={hlsURL + '/master.m3u8' || ''} />

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
                <p className="text-lg text-text_label">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis molestiae eveniet adipisci expedita cupiditate repellendus labore laborum voluptatibus officia, omnis blanditiis non, fuga sed? Quidem dolorum vel aspernatur delectus iure!</p>
                <div className="flex flex-row justify-start items-center gap-4">
                    <Button icon={Plus} Title={'Add to Playlist'} />
                    <Button icon={Heart} Title={'Add to Playlist'} />

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
        </div>)
}