import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
