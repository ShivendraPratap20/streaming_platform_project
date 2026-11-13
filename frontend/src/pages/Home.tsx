import React from "react";
import { useQuery } from "@tanstack/react-query";
import Banner from "../components/Banner";
import api from "../api/axios";
import MediaCardContainer from "../components/MediaCardContainer";
import { useDispatch } from "react-redux";
import { setHomeMediaData } from "../redux/slice/homeMediaDataSlice";

export default function Home(): React.JSX.Element {
    const dispatch = useDispatch();
    const { isSuccess, data } = useQuery({
        queryKey: ['trendingMediaData'],
        queryFn: async () => {
            const data = await api.get('/media/homeMedia');
            dispatch(setHomeMediaData(data));
            return data;
        }
    });

    return <>
        <main className="flex flex-col gap-y-5  p-0 ">


            <Banner />
            {isSuccess && <MediaCardContainer
                title="Trending"
                mediaCardData={data.trendingMedia} />
            }
            {isSuccess && <MediaCardContainer
                title="Movies"
                mediaCardData={data.movieMedia} />
            }
            {isSuccess && <MediaCardContainer
                title="Music"
                mediaCardData={data.musicMedia} />
            }
        </main>
    </>
}