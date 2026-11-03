import React from "react";
import { useSelector } from "react-redux";
import MediaCard from "../MediaCard";
import { useModalContext } from "../../context/ModalContext";
import useAuth from '../../hooks/useAuth';

const useHomeMediaData = () => {
    const homeMediaData = useSelector((state: any) => state.homeMediaData);
    return homeMediaData;
};

const ProfileBadge = ({ userName, profileImageURL }: { userName: string; profileImageURL: string }): React.JSX.Element => {
    const { openModal } = useModalContext();
    const { isLoading, data, isAuthenticated } = useAuth();
    return (
        <div className="lg:flex flex-row items-center p-2 rounded-4xl bg-container w-[100%]"
            onClick={() => openModal('login')}
        >
            <div className="user-info-pic-text flex flex-row gap-x-2 items-center">
                <img src={profileImageURL} alt={`${userName}'s profile`} width={50} height={50} className="rounded-full" />
                <p className="user-info-text text-text_label text-sm">{
                    isAuthenticated? data.userName : userName
                    }</p>
            </div>
        </div>
    );
};

const MoviesTab = (): React.JSX.Element => {
    const { movieMedia } = useHomeMediaData();
    return (
        <div className="flex flex-row flex-wrap gap-2 gap-y-2  overflow-y-auto scrollbar-thin scrollbar-thumb-container scrollbar-track-surface_2">
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
    );
};

const MusicTab = (): React.JSX.Element => {
    const { musicMedia } = useHomeMediaData();
    return (
        <div className="flex flex-row flex-wrap gap-2 gap-y-2  overflow-y-auto scrollbar-thin scrollbar-thumb-container scrollbar-track-surface_2">
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
    return (
        <div className="flex flex-col gap-y-5  overflow-y-auto h-[100vh] scrollbar-thin scrollbar-thumb-container scrollbar-track-surface_2">
            <h1 className="text-xl font-bold text-text_primary">Favorites Tab</h1>
        </div>
    );
};

export {
    MoviesTab,
    MusicTab,
    UploadsTab,
    FavoritesTab,
    ProfileBadge,
};