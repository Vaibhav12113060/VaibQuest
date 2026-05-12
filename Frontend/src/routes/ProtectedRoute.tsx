import { Navigate, Outlet } from "react-router-dom";

const isTokenValid = (token: string | null) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch (error) {
    return false; // If token is malformed
  }
};

const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const token = localStorage.getItem("token");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : {};

  /*
  =====================================
  NOT LOGGED IN OR TOKEN INVALID
  =====================================
  */

  if (!isTokenValid(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" />;
  }

  /*
  =====================================
  ADMIN ACCESS
  =====================================
  */

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
