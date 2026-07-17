import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import AIChatWidget from "../components/AIChatWidget";

const AdminLayout = () => {
  return (
    <>
      <Navbar />

      <div className="p-6 pt-24 md:pt-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
      <AIChatWidget />
    </>
  );
};

export default AdminLayout;
