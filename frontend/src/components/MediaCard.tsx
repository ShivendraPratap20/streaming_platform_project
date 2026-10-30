
import React from "react";
import { type MediaDataType } from "../utils/interfaces";
import { Meta, useNavigate } from "react-router";

const MediaCard = ({
    _id,
    mediaName,
    mediaType,
    mediaDetails: { duration }
}: MediaDataType): React.JSX.Element => {
    const navigate = useNavigate();
    duration = Math.floor(duration);
    const formattedDuration = `${Math.floor(duration / 60)
        .toString()
        .padStart(2, "0")}:${(duration % 60)
            .toString()
            .padStart(2, "0")}`;
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
      onClick={()=>{
        navigate(`/player/${_id}`, {
            state: {
                mediaName,
                mediaType,
            }
        })
      }}
        >
            <div className="relative w-full flex-1 min-h-0">
                <img
                    src={'/thumbnail.png'}
                    alt={mediaName}
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
                    {mediaName}
                </h3>

                <p className="text-[10px] sm:text-xs text-text_label line-clamp-2">
                    {mediaType}
                </p>
            </div>
        </div>
    );
};

export default MediaCard;
