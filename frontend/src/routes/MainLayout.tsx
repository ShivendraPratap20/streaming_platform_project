import { Outlet } from "react-router";
import TabComponent from "../components/TabComponent";
import Header from "../components/Header";

const MainLayout = () => {
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

      <main className="lg:col-span-2 lg:col-start-2 lg:col-end-4 lg:row-span-2 p-0">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;