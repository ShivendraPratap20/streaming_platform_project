import useAuth from "../hooks/useAuth";
import { useModalContext } from "../context/ModalContext";
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

const ProtectedRoute = () => {
    const { isLoading, data, isAuthenticated }: { isLoading: boolean, data: any, isAuthenticated: boolean } = useAuth();
    const { openModal } = useModalContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !isAuthenticated)
            openModal("login")
    }, [isLoading, data, isAuthenticated]);

    if (isLoading)
        return <h1>Loading</h1>

    else if (!isLoading && !isAuthenticated)
        return (
            <main className="flex flex-col gap-4 items-center justify-center h-[100%]">
                <p className="text-2xl text-text_label">Login and start adding video/music to your favorite</p>
                <button onClick={() => openModal("login")} className="bg-custom_purple p-6 text-lg text-text_primary p-2 rounded w-60">LogIn</button>
                <button onClick={() => navigate("/")} className="text-lg text-custom_purple">Cancel</button>
            </main>)

    else if(!isLoading && isAuthenticated)
        return <Outlet/>

};

export default ProtectedRoute