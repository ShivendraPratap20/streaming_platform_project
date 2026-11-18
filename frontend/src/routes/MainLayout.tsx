import { Outlet } from "react-router";
import TabComponent from "../components/TabComponent";
import Header from "../components/Header";

const MainLayout = () => {

  return (
    <div className="
    flex
    flex-row
    gap-8

    h-screen w-screen 
    overflow-hidden
    ">

      <TabComponent />

      <div className="bg-new_pg_bg flex-1 p-4 rounded-2xl my-6 overflow-y-auto h-[100%] scrollbar-thin scrollbar-thumb-container">
        <Header />
        <Outlet/>
      
      </div>
    </div>
  );
};

export default MainLayout;