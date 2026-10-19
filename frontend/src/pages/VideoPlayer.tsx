import React from "react"
import { useLoaderData } from "react-router"

export default function VideoPlayer(): React.JSX.Element{
    let id = useLoaderData()
    return <h1>{`Playing ${id}`}</h1>
}