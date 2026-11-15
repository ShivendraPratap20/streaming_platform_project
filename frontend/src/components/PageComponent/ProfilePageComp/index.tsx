import { useQuery } from "@tanstack/react-query";
import { type UseQueryResult } from "@tanstack/react-query";
import { useModalContext } from "../../../context/ModalContext";
import MediaCardContainer from "../../MediaCardContainer";
import api from "../../../api/axios";
import { type User, type MediaDataType } from "../../../utils/interfaces";
import { CountCard, Dashboard } from "../ProfilePageComp";
import { Play, Upload } from "lucide-react";
import PlaylistCardContainer from "../../PlaylistCardContainer";

const MySpace = (): React.JSX.Element => {
    const { isLoading: favIsLoading, isError: favIsError, data: favData }: UseQueryResult = useQuery({
        queryKey: ['favMediaData'],
        queryFn: async (): Promise<MediaDataType[]> => {
            const data: MediaDataType[] = await api.get("/user/myFavorites");
            return data;
        },
    });

    return (<>
        {(!favIsLoading && !favIsError) && <MediaCardContainer
            title="My Favorites"
            mediaCardData={favData}
        />}
        <PlaylistCardContainer />
    </>);
};


const MyDashboard = (): React.JSX.Element | undefined => {
    const { openModal }: { openModal: (param: string) => void} = useModalContext();

    const { isLoading, isError, data }: UseQueryResult = useQuery({
        queryKey: ["dashDt"],
        queryFn: async () => {
            const data: User = await api.get("/media/dashboard");
            return data
        }
    });

    if (isLoading)
        return <h1 className="text-lg text-text_label text-center">Loading Dashboard data</h1>

    else if (isError)
        return <h1 className="text-lg text-red-300 text-center">Error while loading dashboard data</h1>

    else if (!isLoading && !isError && data)
        return (
            <>
                <div className="countcard_container flex flex-row gap-2 items-center flex-wrap">
                    <CountCard title="Total Media" number={data[0].totalMediaCount} icon={Play} />
                    <CountCard title="Video" number={data[0].videoMedia.count} icon={Play} />
                    <CountCard title="Audio" number={data[0].audioMedia.count} icon={Play} />
                    <CountCard title="Total Views" number={12} icon={Play} />
                </div>

                <Dashboard mediaFilesArray={[...data[0].videoMedia.files, ...data[0].audioMedia.files]} />

                <button className="absolute right-10 bottom-10 bg-dark_blue text-custom_blue p-4 flex flex-row items-center justify-center rounded-xl"
                    onClick={() => openModal('upload')}
                >
                    <span><Upload size={30} color="var(--color-custom_blue)" /></span>
                    Upload Media
                </button>
            </>
        );
};

export {
    MySpace,
    MyDashboard,
}