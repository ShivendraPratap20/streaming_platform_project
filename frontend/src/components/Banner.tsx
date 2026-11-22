import React from "react";
import { Video, Music, Play } from "lucide-react";

const Banner = (): React.JSX.Element => {
    return (
        <section className="relative w-full min-h-[420px] md:min-h-[480px] lg:min-h-[520px] overflow-hidden rounded-2xl">

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/public/streamvibe-banner.png')",
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

            {/* Additional Bottom Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Banner Content */}
            <div className="relative z-10 flex flex-col items-start justify-start gap-y-6 p-6 md:p-10 lg:p-14 max-w-3xl">

                {/* Badge */}
                <div className="flex items-center gap-2 border border-custom_blue rounded-full px-3 py-2">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-custom_purple to-custom_pink px-3 py-2 rounded-full">
                        <Video size={18} color="white" />
                        <Music size={18} color="white" />
                    </div>

                    <span className="text-text_label text-sm">
                        Video & Audio
                    </span>
                </div>

                {/* Heading */}
                <div className="flex flex-col gap-y-3">
                    <h1 className="text-text_label font-bold text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight">
                        Movies, Shows,
                        <br />
                        Music & More
                    </h1>

                    <h2 className="text-custom_pink font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        Stream It All.
                    </h2>

                    <p className="text-text_label/80 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                        Watch your favorite movies and series, or just
                        press play on great music and podcasts.
                        Everything you love, all in one place.
                    </p>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap items-center gap-4">
                    <button className="flex items-center gap-2 rounded-full md:px-4 md:py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-custom_purple to-custom_pink text-white font-semibold hover:opacity-90 transition">
                        <Play size={18} fill="white" />
                        Start Streaming
                    </button>
                </div>

            </div>
        </section>
    );
};

export default Banner;
