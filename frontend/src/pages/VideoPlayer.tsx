import React, { useState, useEffect } from "react"
import { useLoaderData } from "react-router"
import { useQuery } from "@tanstack/react-query";
import VideoPlayer from "../components/VideoPlayer";

export default function VideoPlayerPage(): React.JSX.Element {
    let id = useLoaderData()
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
        fetchVideoData();
    }, [id]);

    if(!data)
        return <h1>Loading....</h1>

    return (
        <>
            <h1>{`Playing ${id}`}</h1>
            <VideoPlayer src={data?.data?.hlsURL+'/master.m3u8' || ''}/>
        </>)
}