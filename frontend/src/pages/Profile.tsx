import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type UseQueryResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ProfileCard } from "../components/PageComponent/ProfilePageComp";
import MediaCardContainer from "../components/MediaCardContainer";
import useAuth from "../hooks/useAuth";
import api from "../api/axios";

const ProfilePage = (): React.JSX.Element => {
    const { isLoading, data, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { isLoading: loading, isError, data: userData }:UseQueryResult = useQuery({
        queryKey: ["userData"],
        queryFn: async () => {
            const data = await api.get("/user/");
            console.log(data);
            return data
        }
    });

    useEffect(() => {
        if (!isLoading && !isAuthenticated)
            navigate("/");
    }, [isLoading, data, isAuthenticated]);


    if (isLoading || loading)
        return <h1 className="text-text_label text-2xl text-center">Loading</h1>

    return (
        <section className="">
            <ProfileCard {...userData} />
            <div className="my-10">
                <MediaCardContainer 
                title="Recently Watched"
                mediaCardData={userData?.mediaHistory}
                />
            </div>
        </section>
    )
};

export default ProfilePage;