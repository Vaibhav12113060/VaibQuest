import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current route

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutHandler = () => {
    setIsMobileMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // Function to determine active class for Desktop Menu
  const getLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    if (path === "/admin") {
      return `transition pb-1 ${
        isActive
          ? "text-yellow-400 border-b-2 border-yellow-400"
          : "text-yellow-400 hover:text-yellow-300"
      }`;
    }
    return `transition pb-1 ${
      isActive
        ? "text-blue-400 border-b-2 border-blue-400"
        : "hover:text-blue-400"
    }`;
  };

  // Function to determine active class for Mobile Menu
  const getMobileLinkClass = (path: string, isFirst = false) => {
    const isActive = location.pathname.startsWith(path);
    const baseClass = `block text-base transition font-medium ${isFirst ? "mt-3" : ""}`;
    if (path === "/admin") {
      return `${baseClass} ${
        isActive
          ? "text-yellow-400 border-l-4 border-yellow-400 pl-2"
          : "text-yellow-400 hover:text-yellow-300"
      }`;
    }
    return `${baseClass} ${
      isActive
        ? "text-blue-400 border-l-4 border-blue-400 pl-2"
        : "hover:text-blue-400"
    }`;
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <img
            src="/Logo.png"
            alt="VaibQuest Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-wide hidden sm:block">
            VaibQuest
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium text-sm sm:text-base">
          <Link to="/dashboard" className={getLinkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/my-quests" className={getLinkClass("/my-quests")}>
            My Quests
          </Link>
          <Link to="/leaderboard" className={getLinkClass("/leaderboard")}>
            Leaderboard
          </Link>
          <Link to="/profile" className={getLinkClass("/profile")}>
            Profile
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className={getLinkClass("/admin")}>
              Admin
            </Link>
          )}
          <button
            onClick={logoutHandler}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition ml-2 shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 px-6 pt-2 pb-6 space-y-5 border-t border-gray-700 shadow-xl absolute w-full left-0">
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getMobileLinkClass("/dashboard", true)}
          >
            Dashboard
          </Link>
          <Link
            to="/my-quests"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getMobileLinkClass("/my-quests")}
          >
            My Quests
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getMobileLinkClass("/leaderboard")}
          >
            Leaderboard
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={getMobileLinkClass("/profile")}
          >
            Profile
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass("/admin")}
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={logoutHandler}
            className="w-full text-center bg-red-600 hover:bg-red-700 px-5 py-3 mt-4 rounded-lg font-semibold transition shadow-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
