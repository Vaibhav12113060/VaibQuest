import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import SubmissionCard from "../components/SubmissionCard";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

import {
  getQuestSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../services/userQuest.service";

const QuestSubmissions = () => {
  const params = useParams();
  const targetQuestId = params.questId || params.id || "";

  const [submissions, setSubmissions] = useState([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchSubmissions(1);
  }, [targetQuestId]);

  const fetchSubmissions = async (page: number) => {
    if (!targetQuestId) return;
    try {
      const response = await getQuestSubmissions(targetQuestId, page, 4);

      setSubmissions(response.submissions || []);
      setPagination(response.pagination || { currentPage: 1, totalPages: 1 });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    fetchSubmissions(page);
    window.scrollTo(0, 0);
  };

  const approveHandler = async (submissionId: string) => {
    try {
      const response = await approveSubmission(submissionId);

      toast.success(response.message);

      fetchSubmissions(pagination.currentPage);
    } catch (error: any) {
      console.error("Approve API Error:", error);
      let errorMessage = "Something went wrong";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => err.msg)
          .join(", ");
      } else if (error.response?.status === 404) {
        errorMessage =
          "API Error (404): Route not found. Backend check karein.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const rejectHandler = (submissionId: string) => {
    setRejectingId(submissionId);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectingId) return;

    try {
      let reviewMessage = rejectReason;
      if (reviewMessage.trim() === "") {
        reviewMessage = "No reason provided"; // Fallback to avoid breaking
      }

      const response = await rejectSubmission(rejectingId, reviewMessage);

      toast.success(response.message);

      fetchSubmissions(pagination.currentPage);
      setIsRejectModalOpen(false);
    } catch (error: any) {
      console.error("Reject API Error:", error);
      let errorMessage = "Something went wrong";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => err.msg)
          .join(", ");
      } else if (error.response?.status === 404) {
        errorMessage =
          "API Error (404): Check if backend route is PUT or POST.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quest Submissions</h1>

      <div className="grid md:grid-cols-2 gap-5">
        {submissions.map((submission: any) => (
          <SubmissionCard
            key={submission._id}
            submission={submission}
            onApprove={approveHandler}
            onReject={rejectHandler}
          />
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4">Reject Submission</h2>
            <textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border px-4 py-2 rounded h-24 mb-4 outline-none resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestSubmissions;
