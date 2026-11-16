import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { Pencil, Video, Music } from "lucide-react";
import { formatTime } from "../../utils";
import api from "../../api/axios";

const PlaylistItemCard = ({ itemData }: {itemData: any}) => {
    const { _id, mediaName, artistName, mediaDetails, mediaType }: any = itemData;

    return (
        <div className="flex flex-row justify-between p-2 bg-container rounded-2xl"
            onClick={() => {
               
                
            }}

        >
            <div className="flex flex-row gap-2 items-center">
                <img
                    src={'/thumbnail.png'}
                    width={100} height={100}
                    alt={mediaName}
                    className="rounded-xl
                    center"
                />
                <div>
                    <p className="text-lg text-text_primary">{mediaName}</p>
                    <p className="text-sm text-text_label">{artistName}</p>
                </div>
            </div>

            <div className="flex flex-row items-center gap-4">
                <p className="text-md text-text_label">{formatTime(mediaDetails.duration)}</p>
                {
                    mediaType == "video" ? (
                        <Video size={20} color="var(--color-text_label)" />
                    ) : (
                        <Music size={20} color="var(--color-text_label)" />
                    )
                }
            </div>
        </div>
    )
};

const PlaylistModal = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void, data: any }): React.JSX.Element | null => {
    if (!isOpen) return null;

    const { isLoading, isError, data: playlistItemArray }: UseQueryResult = useQuery({
        queryKey: ['playlistItemArray'],
        queryFn: async () => {
            const response = await api.get(`/user/myPlaylistItems/${data.playlistName}`);
            return response;
        }
    });


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
            bg-black/70 backdrop-blur-sm p-2 sm:p-4"
            onClick={onClose}
        >
            <div className="w-[100vw] md:w-[80%] lg:w-[50%] bg-surface_1 p-2 md:p-4 lg:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/** Playlist Modal head section */}
                <section className="flex flex-col items-center gap-4 sm:text-lg md:text-xl lg:text-2xl">
                    <img
                        src={'/thumbnail.png'}
                        width={300} height={300}
                        alt={data.playlistName}
                        className="rounded-xl
                    center"
                    />
                    <div className="flex felx-row justify-center gap-2 items-center">
                        <p className="text-center">{data.playlistName}</p>
                        <Pencil size={20} color="var(--color-text_label)" />
                    </div>
                </section>
                {/** Playlist Modal head section */}

                {/* Playlist Modal body section */}
                <section>

                </section>
                {/* Playlist Modal body section */}
                <section className="flex flex-col gap-4 py-8">
                    {
                        isLoading && <p className="text-3xl text-center text-text_label">Loading Playlist.....</p>
                    }
                    {
                        !isLoading && isError && <p className="text-3xl text-center text-red-300">Something Went Wrong</p>
                    }
                    {
                        !isLoading && !isError && playlistItemArray &&
                        playlistItemArray.map((val: any, idx: number) => {
                            return <PlaylistItemCard
                                key={`${val.mediaName}_${val.id}`}
                                itemData={val}
                            />
                        })
                    }
                </section>
                {/* Playlist Modal body section */}

                { }
            </div>
        </div>
    )
};

export default PlaylistModal;