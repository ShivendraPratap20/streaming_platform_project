import React, { useState, useEffect } from "react"
import { useLoaderData, useLocation } from "react-router"
import { useQuery } from "@tanstack/react-query";
import VideoPlayer from "../components/VideoPlayer";

export default function VideoPlayerPage(): React.JSX.Element {
    let { state } = useLocation();
    const [data, setData] = useState<{status: boolean, data: { hlsURL: string} | null}>();
    const fetchVideoData = async () => {
        fetch(`http://localhost:8000/api/v1/video/${id}/stream`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data)
                setData(data);
            })
            .catch((error) => {
                console.log(error);
            })
    };

    useEffect(() => {
       console.log(state)
    }, [state]);

    if(!state)
        return <h1>Loading....</h1>

    return (
        <>
            <h1>{`Playing ${state.mediaName}`}</h1>
            <VideoPlayer src={data?.data?.hlsURL+'/master.m3u8' || ''}/>
        </>)
}