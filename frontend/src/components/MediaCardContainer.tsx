
import React from "react";
import { type MediaCardContainerData } from "../utils/interfaces";
import MediaCard from "./MediaCard";


const MediaCardContainer = ({
    title,
    mediaCardData
}: MediaCardContainerData): React.JSX.Element => {
    return (
        <section className="w-full flex flex-col gap-3">

            {/* Section Heading */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {title}
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
                {mediaCardData.map((item) => (
                    <div key={item._id} className="shrink-0">
                        <MediaCard {...item} />
                    </div>
                ))}
            </div>

        </section>
    );
};

export default MediaCardContainer;
