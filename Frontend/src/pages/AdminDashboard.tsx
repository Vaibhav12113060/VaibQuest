import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllQuests, deleteQuest } from "../services/quest.service";
import { getAllUsers } from "../services/auth.service";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";

const AdminDashboard = () => {
  const [quests, setQuests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [questPagination, setQuestPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchDashboardData(1);
  }, []);

  const fetchDashboardData = async (page: number) => {
    try {
      setLoading(true);
      // Fetch quests and users in parallel
      const [questsRes, usersRes] = await Promise.all([
        getAllQuests(page, 5),
        getAllUsers(),
      ]);
      setQuests(questsRes.quests || []);
      setQuestPagination(
        questsRes.pagination || { currentPage: 1, totalPages: 1 },
      );
      setUsers(usersRes.users || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuest = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this quest? This action cannot be undone.",
      )
    ) {
      try {
        const res = await deleteQuest(id);
        toast.success(res.message);
        fetchDashboardData(questPagination.currentPage); // Refresh data on current page
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete quest");
      }
    }
  };

  if (loading) return <p className="p-4 text-center">Loading Dashboard...</p>;

  const handleQuestPageChange = (page: number) => {
    fetchDashboardData(page);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/create-quest"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create New Quest
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-black">
          <p className="text-gray-500 font-medium">Total Quests</p>
          <p className="text-4xl font-bold">{quests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-gray-500 font-medium">Total Users</p>
          <p className="text-4xl font-bold">{users.length}</p>
        </div>
      </div>

      {/* Quests Management Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Quests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b-2">
              <tr className="bg-gray-50 whitespace-nowrap">
                <th className="p-3 font-semibold min-w-[200px]">Title</th>
                <th className="p-3 font-semibold min-w-[80px]">XP</th>
                <th className="p-3 font-semibold min-w-[100px]">Difficulty</th>
                <th className="p-3 font-semibold text-center min-w-[200px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {quests.map((quest) => (
                <tr key={quest._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{quest.title}</td>
                  <td className="p-3">{quest.rewardXP}</td>
                  <td className="p-3 capitalize">{quest.difficulty}</td>
                  <td className="p-3 flex justify-center items-center gap-2">
                    <Link
                      to={`/admin/submissions/${quest._id}`}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-200"
                    >
                      Submissions
                    </Link>
                    <button
                      onClick={() => handleDeleteQuest(quest._id)}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {quests.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No quests have been created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={questPagination.currentPage}
          totalPages={questPagination.totalPages}
          onPageChange={handleQuestPageChange}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
