import { useEffect, useState } from "react";

import QuestCard from "../components/QuestCard";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

import { getAllQuests } from "../services/quest.service";
import { getMyJoinedQuests } from "../services/userQuest.service";

const Dashboard = () => {
  const [quests, setQuests] = useState([]);
  const [joinedQuestIds, setJoinedQuestIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchQuests(1);
  }, []);

  const fetchQuests = async (page: number) => {
    try {
      setLoading(true);
      const [questsRes, joinedRes] = await Promise.all([
        getAllQuests(page, 3),
        getMyJoinedQuests(1, 1000), // Map all joined statuses regardless of pagination
      ]);

      setQuests(questsRes.quests || []);
      setPagination(questsRes.pagination || { currentPage: 1, totalPages: 1 });
      const joinedIds =
        joinedRes.quests
          ?.map((q: any) => q.questId?._id || q.questId)
          .filter(Boolean) || [];
      setJoinedQuestIds(joinedIds);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchQuests(page);
    window.scrollTo(0, 0);
  };

  if (loading && quests.length === 0) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Welcome Banner */}
      <div className="mb-10 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
          Welcome back,{" "}
          <span className="text-blue-400">
            {user?.username ||
              (user?.role === "admin" ? "Admin" : "Quest Hunter")}
          </span>
          ! {user?.role === "admin" ? "👑" : "👋"}
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl">
          {user?.role === "admin"
            ? "Ready to oversee the realm? Monitor active quests, review recent submissions, and manage the quest hunters."
            : "Ready to take on new challenges and earn more XP? Explore the available quests below and start your journey."}
        </p>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Quests</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Discover and join new quests to earn XP and level up your profile!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest: any) => (
          <QuestCard
            key={quest._id}
            quest={quest}
            isJoinedStatus={joinedQuestIds.includes(quest._id)}
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

export default Dashboard;
