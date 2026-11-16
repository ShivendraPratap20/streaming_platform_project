import { Pencil } from "lucide-react";
import { type LucideIcon, Video, Music, } from "lucide-react";
import type { User } from "../../utils/interfaces";
import { useModalContext } from "../../context/ModalContext";
import ProfilePicture from "../ProfilePicture";

const ProfileCard = (props: User): React.JSX.Element => {
    const { openModal, setModalData }: { openModal: (param: string) => void } = useModalContext();

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
                    <ProfilePicture
                        userName={props.userName}
                        imageSrc={props.profilePicture}
                        onImageChange={()=>{}}
                    />
                    <div>
                        <h1 className="text-text_primary text-4xl">{props.userName || ""}</h1>
                        <h4 className="text-text_label text-lg">{props.userID || ""}</h4>
                        <span className="flex flex-row items-center gap-2 text-text_label">
                            {
                                props.profileTag?.map((val: string, idx: number) =>
                                    <p key={`${val}_${idx}`}>{val}</p>
                                )
                            }
                        </span>
                        <p className="text-text_label">{props.aboutUserInfo || ""}</p>
                    </div>
                </div>
                <div className="profile_button">
                    <button
                        type="button"
                        className="flex flex-row gap-2 justify-center items-center p-3 sm:text-base md:text-lg text-text_label bg-container rounded-xl"
                        onClick={() => {
                            setModalData(props)
                            openModal('update')
                        }}
                    >
                        <Pencil size={25} color="var(--color-text_label)" />
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

const CountCard = ({ icon: Icon, title, number, }: {
    icon: LucideIcon; title: string; number: number;
}): React.JSX.Element => {
    return (
        <div className="flex flex-row gap-2 p-4 lg:flex-1 bg-surface_1 rounded-2xl">
            <div className="p-4 rounded-full bg-custom_purple flex items-center justify-center">
                <Icon size={30} color="var(--color-text_primary)" />
            </div>
            <div>
                <p className="md:text-lg lg:text-xl text-text_primary">{title}</p>
                <p className="md:text-lg lg:text-lg text-text_label">{number}</p>
            </div>
        </div>
    );
};

const DashboardCard = ({ key, mediaName, mediaType, fileStatus, createdAt }: any) => {

    let colorArray = {
        UPLOADING: {
            bgColor: "bg-uploading-bg",
            textColor: "text-uploading-text",
        },
        UPLOADED: {
            bgColor: "bg-uploaded-bg",
            textColor: "text-uploaded-text",
        },
        QUEUED: {
            bgColor: "bg-queued-bg",
            textColor: "text-queued-text",
        },
        PROCESSING: {
            bgColor: "bg-processing-bg",
            textColor: "text-processing-text",
        },
        READY: {
            bgColor: "bg-ready-bg",
            textColor: "text-ready-text",
        },
        FAILED: {
            bgColor: "bg-failed-bg",
            textColor: "text-failed-text",
        }
    };

    return (
        <div key={key} className="flex flex-row gap-5 justify-between items-center p-4 rounded-2xl hover:bg-container">

            <div className="flex flex-row gap-2 w-[50%] items-center">
                <img src="/public/profile.png" alt="" width={60} height={60} className="rounded-xl" />
                <p className="text-lg text-text_primary">{mediaName}</p>
            </div>

            <div className="flex flex-row gap-2">
                {
                    mediaType == "video" ? <Video size={30} color="var(--color-text_label)" /> : <Music size={30} color="var(--color-text_label)" />
                }
                <p className="text-lg text-text_label">{mediaType}</p>
            </div>

            <div className={`${colorArray[fileStatus].bgColor} p-2 flex items-center rounded-2xl`}>
                <p className={`${colorArray[fileStatus].textColor}`}>{fileStatus}</p>
            </div>

            <div className="text-lg text-text_label">
                {createdAt}
            </div>
        </div>)
};

const Dashboard = ({ mediaFilesArray }: any) => {
    return (
        <>
            <h1 className="text-2xl text-text_primary">Your Uploaded media</h1>
            <div className="container flex flex-col overflow-x-auto h-100">
                {
                    mediaFilesArray.map((val: any, idx: number) => {
                        return <DashboardCard key={idx} {...val} />
                    })
                }
            </div>
        </>
    )
}

export {
    ProfileCard,
    CountCard,
    Dashboard,
}