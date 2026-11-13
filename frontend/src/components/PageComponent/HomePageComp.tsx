import React from "react";
import { useSelector } from "react-redux";
import MediaCard from "../MediaCard";
import { useModalContext } from "../../context/ModalContext";
import useAuth from '../../hooks/useAuth';
import { useNavigate } from "react-router";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "../../api/axios";

const useHomeMediaData = () => {
    const homeMediaData = useSelector((state: any) => state.homeMediaData);
    return homeMediaData;
};

const ProfileBadge = ({ userName, profileImageURL }: { userName: string; profileImageURL: string }): React.JSX.Element => {
    const { openModal } = useModalContext();
    const { isLoading, data, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const clickHandler = () => {
        isAuthenticated ? navigate('/profile') : openModal('login');
    };

    return (
        <div className="lg:flex flex-row items-center p-2 rounded-4xl bg-container w-[100%]"
            onClick={clickHandler}>

            <div className="user-info-pic-text flex flex-row gap-x-2 items-center">
                <img src={profileImageURL} alt={`${userName}'s profile`} width={50} height={50} className="rounded-full" />
                <p className="user-info-text text-text_label text-sm">{
                    isAuthenticated ? data.userName : userName
                }</p>
            </div>
        </div>
    );
};

const MoviesTab = (): React.JSX.Element => {
    const { movieMedia } = useHomeMediaData();
    return (
        <div className="flex flex-col gap-4">
            <h1 className="md:text-xl lg:text-3xl text-text_primary">Movies</h1>
            <div className="flex flex-row flex-wrap gap-2 gap-y-2  justify-start">
                {
                    movieMedia.length > 0 ? (
                        movieMedia.map((movie: any) => (
                            <div key={movie._id}>
                                <MediaCard {...movie} />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-text_secondary">No movies available.</p>
                    )
                }
            </div>
        </div>
    );
};

const MusicTab = (): React.JSX.Element => {
    const { musicMedia } = useHomeMediaData();
    return (
        <div className="flex flex-col gap-4">
            <h1 className="md:text-xl lg:text-3xl text-text_primary">Music</h1>
            <div className="flex flex-row flex-wrap gap-2 gap-y-2 ">
                {
                    musicMedia.length > 0 ? (
                        musicMedia.map((song: any) => (
                            <div key={song._id}>
                                <MediaCard {...song} />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-text_secondary">No music available.</p>
                    )
                }
            </div>
        </div>
    );
};

const UploadsTab = (): React.JSX.Element => {
    return (
        <div className="flex flex-col gap-y-5  overflow-y-auto h-[100vh] scrollbar-thin scrollbar-thumb-container scrollbar-track-surface_2">
            <h1 className="text-xl font-bold text-text_primary">Uploads Tab</h1>
        </div>
    );
};

const FavoritesTab = (): React.JSX.Element => {
    const { isLoading, isError, error, data }: UseQueryResult = useQuery({
        queryKey: ['favDt'],
        queryFn: async () => {
            const data = await api.get("/user/myFavorites");
            return data;
        }

    });
    if (isLoading)
        return <h1>Loading</h1>;

    else if (!isLoading && isError)
        return <h1>Something went wrong</h1>

    else if (!isLoading && !isError && data)
        return (
            <div className="flex flex-col gap-4">
                <h1 className="md:text-xl lg:text-3xl text-text_primary">My Favorites</h1>
                <div className="flex flex-row flex-wrap gap-2 gap-y-2 ">
                    {
                        data.length > 0 ? (
                            data.map((dt: any) => (
                                <div key={dt._id}>
                                    <MediaCard {...dt} />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-text_secondary">No music available.</p>
                        )
                    }
                </div>
            </div>
        );

    else return <></>
};

export {
    MoviesTab,
    MusicTab,
    UploadsTab,
    FavoritesTab,
    ProfileBadge,
};