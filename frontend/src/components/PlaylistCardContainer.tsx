
import React from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type PlaylistCardData } from "../utils/interfaces";
import { mediaDurationFormat } from "../utils";
import api from "../api/axios";
import { useModalContext } from "../context/ModalContext";

const PlaylistCard = (Media: PlaylistCardData): React.JSX.Element => {
    let { _id, playlistName, playlistItems, totalDuration } = Media;
    const { openModal } = useModalContext();

    const formattedDuration:string = mediaDurationFormat(totalDuration);
    return (
        <div
            className="
        w-[140px] h-[210px]
        sm:w-[205px] sm:h-[220px]
        lg:w-[230px] lg:h-[240px]
        flex flex-col
        overflow-hidden
        rounded-lg
        bg-container
        cursor-pointer
      "
            onClick={() => {
               openModal('playlist');
            }}
        >
            <div className="relative w-full flex-1 min-h-0">
                <img
                    src={'/thumbnail.png'}
                    alt={playlistName}
                    className="w-full h-full object-cover"
                />

                <span
                    className="
            absolute bottom-2 right-2
            bg-black/70
            text-white
            text-[10px] sm:text-xs
            px-2 py-1
            rounded
            font-medium
          "
                >
                    {formattedDuration}
                </span>
            </div>

            <div className="h-[70px] sm:h-[75px] lg:h-[80px] p-2 flex flex-col gap-1 overflow-hidden">
                <h3 className="text-xs sm:text-sm font-semibold text-text_primary line-clamp-1">
                    {playlistName}
                </h3>

                <p className="text-[10px] sm:text-xs text-text_label line-clamp-2">
                    {formattedDuration}
                </p>
                 <p className="text-[10px] sm:text-xs text-text_label line-clamp-2">
                    {`${playlistItems.length} items`}
                </p>
            </div>
        </div>
    );
};

const PlaylistCardContainer = (): React.JSX.Element => {

    const { isLoading, isError, data }:UseQueryResult = useQuery({
        queryKey:['myPlaylist'],
        queryFn: async (): Promise<PlaylistCardData[]> => {
            const data: PlaylistCardData[] = await api.get("/user/myPlaylist");
            return data;
        },
    });


    if(!data || data.length == 0) {
        return (
            <section className="w-full flex flex-col gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-text_primary">
                    My Playlist
                </h2>
                <p className="text-sm text-text_secondary">
                    No media available.
                </p>
            </section>
        );
    }
    return (
        <section className="w-full flex flex-col gap-3">

            {/* Section Heading */}
            <h2 className="text-lg sm:text-xl font-semibold text-text_primary">
                My Playlist
            </h2>

            {/* Horizontal Media List */}
            <div
                className="
          flex
          gap-3 sm:gap-4
          overflow-x-auto
          overflow-y-hidden
          scroll-smooth
          pb-2
          scrollbar-hide
        "
            >
                {data.map((item) => (
                    <div key={item._id} className="shrink-0">
                        <PlaylistCard {...item} />
                    </div>
                ))}
            </div>

        </section>
    );
};

export default PlaylistCardContainer;
