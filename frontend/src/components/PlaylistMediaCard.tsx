
import React from "react";
import { useNavigate } from "react-router";
import { mediaDurationFormat } from "../utils";

type MediaPlaylistProps = {
    _id:string
    playlistName: string,
    playlistDuration: number,
};

const PlaylistMediaCard = (Media: MediaPlaylistProps): React.JSX.Element => {
    let { _id, playlistName, playlistDuration } = Media;
    const navigate = useNavigate();
    const formattedDuration:string = mediaDurationFormat(playlistDuration);
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
                navigate(`/player/${_id}`, {
                    state: {
                        Media,
                    }
                })
            }}
        >
            <div className="relative w-full flex-1 min-h-0">
                <img
                    src={'/thumbnail.png'}
                    alt={playlistName}
                    className="w-full h-full object-cover"
                />

            </div>

            <div className="h-[70px] sm:h-[75px] lg:h-[80px] p-2 flex flex-col gap-1 overflow-hidden">
                <h3 className="text-xs sm:text-sm font-semibold text-text_primary line-clamp-1">
                    {playlistName}
                </h3>

                <p className="text-[10px] sm:text-xs text-text_label line-clamp-2">
                    {formattedDuration}
                </p>
            </div>
        </div>
    );
};

export default PlaylistMediaCard;
