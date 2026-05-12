import { useState, useEffect } from "react";
import { joinQuest } from "../services/userQuest.service";
import toast from "react-hot-toast";

const QuestCard = ({ quest, isJoinedStatus = false }: any) => {
  const [isJoined, setIsJoined] = useState(isJoinedStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsJoined(isJoinedStatus);
  }, [isJoinedStatus]);

  const isExpired = new Date(quest.deadline) < new Date();

  const joinHandler = async () => {
    try {
      setLoading(true);
      const response = await joinQuest(quest._id);

      toast.success(response.message);
      setIsJoined(true);
    } catch (error: any) {
      let errorMessage = "Something went wrong";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => err.msg)
          .join(", ");
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col justify-between hover:shadow-md transition-shadow h-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 line-clamp-2">
          {quest.title}
        </h2>
        <p className="mt-3 text-gray-600 line-clamp-3 leading-relaxed">
          {quest.description}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Reward</span>
          <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-md text-sm">
            {quest.rewardXP} XP
          </span>
        </div>

        <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Deadline</span>
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-sm ${isExpired ? "text-red-600" : "text-gray-800"}`}
            >
              {new Date(quest.deadline).toLocaleDateString()}
            </span>
            {isExpired && (
              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                Expired
              </span>
            )}
          </div>
        </div>

        <button
          onClick={joinHandler}
          disabled={isJoined || loading || isExpired}
          className={`mt-4 w-full py-2.5 rounded-lg font-medium transition-all shadow-sm ${
            isJoined
              ? "bg-green-100 text-green-800 cursor-not-allowed border border-green-200"
              : isExpired
                ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
          }`}
        >
          {isExpired
            ? "Deadline Passed"
            : isJoined
              ? "✓ Joined"
              : loading
                ? "Joining..."
                : "Join Quest"}
        </button>
      </div>
    </div>
  );
};

export default QuestCard;
