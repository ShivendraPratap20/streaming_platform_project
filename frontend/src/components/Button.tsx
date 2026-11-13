import React from "react";
import { type LucideIcon } from "lucide-react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { addToFavorite } from "../api/axios";

type PropsType = {
    buttonTag: string, 
    Title: string,
    mediaID: string,
    icon: LucideIcon,
};

const Button = ({ icon: Icon, Title, mediaID }: PropsType): React.JSX.Element => {
    const { isPending, isError, error, mutate }: UseMutationResult = useMutation({
        mutationFn: () => addToFavorite(mediaID),
        mutationKey: ['addFav'],
    });

    return (
        <button className="flex sm:flex-row flex-col justify-start items-center gap-2 bg-dark_blue p-3 rounded-2xl"
            onClick={()=> mutate()}
        >
            <Icon size={35} color="var(--color-text_label)" />
            <p className="text-lg text-text_label">{Title}</p>
        </button>
    )
};

export default Button; 