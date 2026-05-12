import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">VaibQuest</h1>

      <div className="flex items-center gap-5">
        <Link to="/dashboard">Dashboard</Link>

        <Link to="/my-quests">My Quests</Link>

        <Link to="/leaderboard">Leaderboard</Link>

        <Link to="/profile">Profile</Link>

        {user?.role === "admin" && <Link to="/admin">Admin</Link>}

        <button
          onClick={logoutHandler}
          className="bg-red-500 px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
