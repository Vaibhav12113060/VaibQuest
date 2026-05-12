import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

const AdminLayout = () => {
  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
