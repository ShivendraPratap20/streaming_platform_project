import React from "react";
import { useNavigate } from "react-router";
import TabComponent from '../components/TabComponent';

export default function Home(): React.JSX.Element{
    const navigate = useNavigate();
    const videoID:string = "6ad6369a084f9bc3ceb9f97b";
    const onClickHandler = () => {
        navigate(`/player/${videoID}`);
    }

    return <>   
        <TabComponent/>
    </>
}