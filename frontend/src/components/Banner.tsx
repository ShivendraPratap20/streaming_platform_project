import React from "react";
import { Video, Music } from "lucide-react";

const Banner = ():React.JSX.Element =>{
    return(
        <div className="banner flex flex-col gap-y-5">

            <div className="badge flex flex-row items-center gap-2 border border-custom_blue rounded-4xl px-2 py-2">
                <div className="badge_icon flex flex-row justify-center gap-2 bg-gradient-to-r from-custom_purple to-custom_pink px-2 py-2 rounded-4xl">
                    <Video color="var(--color-text_label)"/>
                    <Music color="var(--color-text_label)"/>
                </div>
                <div className="badge_text text-text_label text-sm">Vide & Audio</div>
            </div>

            <div className="flex flex-col gap-y-1">
                <h3 className="text-text_label">Music, Shows, Music & More</h3>
                <h3 className="text-custom_pink">Stream It All</h3>
                <p className="text-text_label text-sm">Watch your favorite movies and series, or just press play on great music and podcasts</p>
            </div>

        </div>
    )
};



export default Banner;