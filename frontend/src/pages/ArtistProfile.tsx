import { useLocation } from "react-router";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "../api/axios";
import MediaCardContainer from "../components/MediaCardContainer";

interface UserTypes {
    userName: string;
    profilePicture: string;
    userID: string;
    profileTag: string[];
    aboutUserInfo: string;
}

function ArtistProfile() {
    let { state } = useLocation();
    const { artistObjectID, artistName, artistUserID }: { artistObjectID: string, artistName: string, artistUserID: string } = state;

    const { isLoading, isError, data }: UseQueryResult = useQuery({
        queryKey: ['artistData'],
        queryFn: async () => {
            const data:UserTypes = await api.get(`user/artistData?artistName=${artistName}&artistUserID=${artistUserID}&artistObjectID=${artistObjectID}`);
            return data;
        },
    });

    if (isLoading)
        return <h1 className="text-text_label text-2xl text-center">Loading</h1>

    else if (isError || !data)
        return <h1>Unable to load profile.</h1>

    else if (!isLoading && !isError && data)
        return (
            <>
                <section className="flex flex-col gap-4 pt-10">
                    <ProfileCard {...data}/>
                    <MediaCardContainer title="Video" mediaCardData={data?.mediaData.videoData} />
                    <MediaCardContainer title="Audio" mediaCardData={data?.mediaData.audioData} />
                </section>
            </>
        )
};



const ProfileCard = ({ userName, profilePicture, userID, profileTag, aboutUserInfo }: UserTypes): React.JSX.Element => {

    return (
        <div className="profile_container_background rounded-2xl relative overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/thumbnail.png')"
                }}
            />
            <div className="profile_container_surface flex flex-col gap-4 md:flex-row justify-between items-center p-4 relative z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
                <div className="profile flex flex-row items-start gap-4 md:w-1/2">
                    <img
                        alt={userName}
                        src={profilePicture}
                    />
                    <div>
                        <h1 className="text-text_primary text-4xl">{userName || ""}</h1>
                        <h4 className="text-text_label text-lg">{userID || ""}</h4>
                        <span className="flex flex-row items-center gap-2 text-text_label">
                            {
                                profileTag?.map((val: string, idx: number) =>
                                    <p key={`${val}_${idx}`}>{val}</p>
                                )
                            }
                        </span>
                        <p className="text-text_label">{aboutUserInfo || ""}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistProfile;