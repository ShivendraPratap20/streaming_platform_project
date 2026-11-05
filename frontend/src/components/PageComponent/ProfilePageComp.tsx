import { Pencil } from "lucide-react";
import { type LucideIcon, Video, Music, } from "lucide-react";
import type { User } from "../../utils/interfaces";

const ProfileCard = (props: User): React.JSX.Element => {
    return (
        <div className="profile_container_background rounded-2xl bg-blue-200">
            <div className="profile_container_surface flex flex-col gap-4 md:flex-row justify-between items-center p-4">
                <div className="profile flex flex-row items-start gap-4 md:w-1/2">
                    <img
                        src="/profile.png"
                        alt={props.userName || "Profile"}
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                    <div>
                        <h1>{props.userName || ""}</h1>
                        <h4>{props.userID || ""}</h4>
                        <p>{props.description || ""}</p>
                    </div>
                </div>
                <div className="profile_button">
                    <button
                        type="button"
                        className="flex flex-row gap-2 justify-center items-center p-3 sm:text-base md:text-lg text-text_label bg-container rounded-xl"
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
        <div key={key} className="flex flex-row gap-5 justify-between items-center">

            <div className="flex flex-row gap-2 w-[50%] items-center">
                <img src="/public/profile.png" alt="" width={60} height={60} className="rounded-xl" />
                <p className="text-lg text-text_primary">{mediaName}</p>
            </div>

            <div className="flex flex-row gap-2">
                {
                    mediaType == "video" ? <Video size={30} color="var(--color-text_label)"/> : <Music size={30} color="var(--color-text_label)"/>
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
            <div className="container flex flex-col gap-4 overflow-x-auto h-100">
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