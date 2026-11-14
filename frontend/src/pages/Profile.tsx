import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type UseQueryResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ProfileCard } from "../components/PageComponent/ProfilePageComp";
import MediaCardContainer from "../components/MediaCardContainer";
import api from "../api/axios";
import { type User, type MediaDataType } from "../utils/interfaces";
import { CountCard, Dashboard } from "../components/PageComponent/ProfilePageComp";
import { Video, Music, Play, Upload } from "lucide-react";
import { useModalContext } from "../context/ModalContext";
import PlaylistCardContainer from "../components/PlaylistCardContainer";

const ProfilePage = (): React.JSX.Element | undefined => {
    const navigate = useNavigate();
    const { isLoading, isError, data }: UseQueryResult = useQuery({
        queryKey: ["userData"],
        queryFn: async (): Promise<User> => {
            const data: User = await api.get("/user/");
            return data
        }
    });

    const { isLoading: favIsLoading, isError: favIsError, data: favData }: UseQueryResult = useQuery({
        queryKey: ['favMediaData'],
        queryFn: async (): Promise<MediaDataType[]> => {
            const data: MediaDataType[] = await api.get("/user/myFavorites");
            return data;
        },
    });

    const { openModal } = useModalContext();

    useEffect(() => {
        if (!isLoading && isError)
            navigate("/");
    }, [isLoading, isError]);


    if (isLoading)
        return <h1 className="text-text_label text-2xl text-center">Loading</h1>

    else if (isError || !data)
        return <h1>Unable to load profile.</h1>


    // const { isLoading, isError, data }: UseQueryResult = useQuery({
    //     queryKey: ["dashDt"],
    //     queryFn: async () => {
    //         const data: User = await api.get("/media/dashboard");
    //         return data
    //     }
    // });

    if (isLoading)
        return <h1 className="text-lg text-text_label text-center">Loading Dashboard data</h1>

    else if (isError)
        return <h1 className="text-lg text-red-300 text-center">Error while loading dashboard data</h1>

    else if (!isLoading && !isError && data)
        return (
            <section className="flex flex-col gap-4">
                <ProfileCard {...data} />
                <div className="my-10">
                    {(!favIsLoading && !favIsError) && <MediaCardContainer
                        title="My Favorites"
                        mediaCardData={favData}
                    />}

                        <PlaylistCardContainer/>
                </div>
                {/* <div className="countcard_container flex flex-row gap-2 items-center flex-wrap">
                    <CountCard title="Total Media" number={data[0].totalMediaCount} icon={Play} />
                    <CountCard title="Video" number={data[0].videoMedia.count} icon={Play} />
                    <CountCard title="Audio" number={data[0].audioMedia.count} icon={Play} />
                    <CountCard title="Total Views" number={12} icon={Play} />
                </div>

                <Dashboard mediaFilesArray={[...data[0].videoMedia.files, ...data[0].audioMedia.files]} />

                <button className="absolute right-10 bottom-10 bg-dark_blue text-custom_blue p-4 flex flex-row items-center justify-center rounded-xl"
                onClick={()=> openModal('upload')}
                >
                    <span><Upload size={30} color="var(--color-custom_blue)" /></span>
                    Upload Media
                </button> */}

            </section>
        )
};

export default ProfilePage;