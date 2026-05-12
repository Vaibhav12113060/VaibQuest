import { useEffect, useState } from "react";

import LeaderboardCard from "../components/LeaderboardCard";
import Pagination from "../components/Pagination";

import { getLeaderboard } from "../services/userQuest.service";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchLeaderboard(1);
  }, []);

  const fetchLeaderboard = async (page: number) => {
    try {
      const response = await getLeaderboard(page, 5);

      setUsers(response.users);
      setPagination(response.pagination || { currentPage: 1, totalPages: 1 });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    fetchLeaderboard(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-10 mt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          🏆 Global Leaderboard
        </h1>
        <p className="text-gray-500 text-lg">
          See how you rank against other quest hunters!
        </p>
      </div>

      <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border">
        {users.map((user: any, index: number) => (
          <LeaderboardCard
            key={user._id}
            user={user}
            index={(pagination.currentPage - 1) * 5 + index}
          />
        ))}
      </div>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Leaderboard;
