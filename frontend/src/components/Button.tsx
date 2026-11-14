import React, { useCallback } from "react";
import { type LucideIcon } from "lucide-react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { addToFavorite } from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useModalContext } from "../context/ModalContext";

type PropsType = {
    buttonTag: string, 
    Title: string,
    mediaID: string,
    icon: LucideIcon,
};

const Button = ({ icon: Icon, Title, mediaID, buttonTag }: PropsType): React.JSX.Element => {
    const { mutate }: UseMutationResult = useMutation({
        mutationFn: () => addToFavorite(mediaID),
        mutationKey: ['addFav'],
    });
    const { isLoading, data, isAuthenticated } = useAuth();
    const { openModal } = useModalContext();


    const clickHandler = useCallback(()=>{
        if(isAuthenticated && data){
            if(buttonTag == 'FavBtn')
                mutate();
            else if(buttonTag == "PlyLstBtn")
                openModal('playlist');
        }else{
            openModal('login');
        }
    }, [isLoading, data, isAuthenticated]);

    return (
        <button className="flex sm:flex-row flex-col justify-start items-center gap-2 bg-dark_blue p-3 rounded-2xl"
            onClick={clickHandler}
        >
            <Icon size={35} color="var(--color-text_label)" />
            <p className="text-lg text-text_label">{Title}</p>
        </button>
    )
};

export default Button; 