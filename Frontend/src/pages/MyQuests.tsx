import { useEffect, useState } from "react";
import { getMyJoinedQuests } from "../services/userQuest.service"; // Assuming this service function exists
import SubmitQuest from "./SubmitQuest";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";

const MyQuests = () => {
  const [myQuests, setMyQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingQuestId, setSubmittingQuestId] = useState<string | null>(
    null,
  );
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const fetchMyQuests = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getMyJoinedQuests(page, 4);
      setMyQuests(response.quests);
      setPagination(response.pagination || { currentPage: 1, totalPages: 1 });
    } catch (error) {
      console.error("Failed to fetch my quests:", error);
      toast.error("Failed to load your quests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQuests();
  }, []);

  const handlePageChange = (page: number) => {
    fetchMyQuests(page);
    window.scrollTo(0, 0);
  };

  if (loading && myQuests.length === 0) {
    return <p>Loading your quests...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        My Active Quests
      </h1>
      {myQuests.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
          <p className="text-gray-500 text-lg">
            You haven't joined any quests yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myQuests.map((userQuest) => (
              <div
                key={userQuest._id}
                className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {userQuest.questId?.title || "Deleted Quest"}
                  </h2>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        userQuest.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : userQuest.status === "submitted"
                            ? "bg-yellow-100 text-yellow-700"
                            : userQuest.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {userQuest.status || "started"}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      XP: {userQuest.questId?.rewardXP || 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    ⏳ Deadline:{" "}
                    {userQuest.questId?.deadline
                      ? new Date(
                          userQuest.questId.deadline,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {userQuest.status === "rejected" && (
                    <p className="text-sm text-red-600 mt-2 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                      Remark: {userQuest.reviewMessage || "No remark"}
                    </p>
                  )}
                </div>
                <div className="mt-2 pt-4 border-t flex justify-end">
                  {!userQuest.questId ? (
                    <span className="text-red-500 font-medium text-sm italic py-2 w-full text-center">
                      Quest no longer available
                    </span>
                  ) : new Date(userQuest.questId.deadline) < new Date() &&
                    ["started", "joined", "pending"].includes(
                      userQuest.status,
                    ) ? (
                    <span className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold text-sm border border-red-100 w-full text-center">
                      Expired
                    </span>
                  ) : !userQuest.status ||
                    ["started", "joined", "pending"].includes(
                      userQuest.status,
                    ) ? (
                    <button
                      onClick={() => setSubmittingQuestId(userQuest._id)}
                      className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition w-full shadow-sm"
                    >
                      Submit Proof
                    </button>
                  ) : (
                    <span className="text-gray-400 font-medium text-sm italic py-2">
                      Action completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {submittingQuestId && (
        <SubmitQuest
          userQuestId={submittingQuestId}
          onClose={() => setSubmittingQuestId(null)}
          onSuccess={() => {
            setSubmittingQuestId(null);
            fetchMyQuests();
          }}
        />
      )}
    </div>
  );
};

export default MyQuests;
