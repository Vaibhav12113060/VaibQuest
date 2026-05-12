import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/*
=====================================
PAGES
=====================================
*/

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import MyQuests from "../pages/MyQuests";
import Leaderboard from "../pages/Leaderboard";
import Profile from "../pages/Profile";

import AdminDashboard from "../pages/AdminDashboard";
import CreateQuest from "../pages/CreateQuest";
import QuestSubmissions from "../pages/QuestSubmissions";
import UserProfile from "../pages/UserProfile";

/*
=====================================
LAYOUTS
=====================================
*/

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

/*
=====================================
PROTECTED ROUTE
=====================================
*/

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/my-quests" element={<MyQuests />} />

            <Route path="/leaderboard" element={<Leaderboard />} />

            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/admin/create-quest" element={<CreateQuest />} />

            <Route
              path="/admin/submissions/:questId"
              element={<QuestSubmissions />}
            />

            <Route path="/admin/user/:userId" element={<UserProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
