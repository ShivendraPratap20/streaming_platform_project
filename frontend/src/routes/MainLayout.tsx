import { Outlet } from "react-router";
import TabComponent from "../components/TabComponent";
const MainLayout = () => {
  return (
    <div className="flex">
      <TabComponent />
      <main className="flex-1 h-[100vh]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;