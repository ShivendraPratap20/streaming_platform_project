import React from "react";
import { useNavigate } from "react-router";

export default function Home(): React.JSX.Element{
    const navigate = useNavigate();
    const videoID:string = "6ad6369a084f9bc3ceb9f97b";
    const onClickHandler = () => {
        navigate(`/player/:${videoID}`);
    }

    return <>   
        <h1>Home Page</h1>
        <button onClick={onClickHandler}>Play Video</button>
    </>
}