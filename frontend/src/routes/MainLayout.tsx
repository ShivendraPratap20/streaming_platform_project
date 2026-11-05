import { Outlet } from "react-router";
import { type UseQueryResult } from "@tanstack/react-query";
import TabComponent from "../components/TabComponent";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { useModalContext } from "../context/ModalContext";

const MainLayout = () => {
  const { isLoading, isError, error, isSuccess, data }:UseQueryResult = useAuth();
  const { openModal } = useModalContext();

  return (
    <div className="
    lg:grid 
    lg:grid-cols-[15vw_1fr_1fr] 
    lg:grid-rows-[0.5fr_2fr_1fr] 
    gap-x-4
    gap-y-4

    flex flex-col

    h-screen w-screen 
    overflow-hidden
    p-2
    ">

      <TabComponent />

      <Header />

      <main className="lg:col-span-2 lg:col-start-2 lg:col-end-4 lg:row-span-2 p-0 overflow-y-auto scrollbar-thin scrollbar-hide scrollbar-thumb-container scrollbar-track-surface_2">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;