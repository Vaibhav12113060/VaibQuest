import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import AIChatWidget from "../components/AIChatWidget";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <div className="p-6 pt-24 md:pt-6">
        <Outlet />
      </div>
      <AIChatWidget />
    </>
  );
};

export default MainLayout;
