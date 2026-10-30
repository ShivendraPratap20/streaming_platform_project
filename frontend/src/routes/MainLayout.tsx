import { Outlet } from "react-router";
import TabComponent from "../components/TabComponent";
const MainLayout = () => {
  return (
    <div className="flex">
      <TabComponent />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;