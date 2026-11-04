import { Pencil } from "lucide-react";


type PropsType = { 
    userName: string, 
    userID: string, 
    email: string, 
    description: string,
}

const ProfileCard = ({ userName, userID, email, description }: PropsType):React.JSX.Element => {
    return (
        <div className="profile_container_background rounded-2xl bg-blue-200">
            <div className="profile_container_surface flex flex-col gap-4 md:flex-row justify-between items-center p-4">

                <div className="profile flex flex-row items-start gap-4 md:w-1/2">
                    <img src="/public/profile.png" width={100} height={100} className="rounded-full"/>
                    <div>
                        <h1>{userName || ''}</h1>
                        <h4>{userID || ''}</h4>
                        <p>{description || ''}</p>

                    </div>
                </div>
                <div className="profile_button">
                    <button className="flex flex-row gap-2 justify-center items-center p-3 sm:text-base md:text-lg text-text_label bg-container rounded-xl"> 
                        <Pencil size={25} color="var(--color-text_label)"/>
                        Edit</button>
                </div>

            </div>
        </div>
    )
};

export {
    ProfileCard,
}