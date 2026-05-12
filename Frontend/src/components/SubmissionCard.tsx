import { useState } from "react";
import { Link } from "react-router-dom";

const SubmissionCard = ({ submission, onApprove, onReject }: any) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <div className="bg-white p-5 rounded-xl shadow flex flex-col justify-between">
      <div className="flex items-center gap-4 mb-3">
        <Link to={`/admin/user/${submission.userId?._id}`}>
          <img
            src={
              submission.userId?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(submission.userId?.username || "User")}&background=EBF4FF&color=1E3A8A`
            }
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(submission.userId?.username || "User")}&background=EBF4FF&color=1E3A8A`;
            }}
            alt="avatar"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition bg-gray-100"
          />
        </Link>
        <Link
          to={`/admin/user/${submission.userId?._id}`}
          className="hover:text-blue-500 transition"
        >
          <h2 className="text-xl font-bold">{submission.userId?.username}</h2>
        </Link>
      </div>

      <p className="mb-4 capitalize">
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            submission.status === "approved"
              ? "bg-green-100 text-green-800"
              : submission.status === "rejected"
                ? "bg-red-100 text-red-800"
                : submission.status === "submitted"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {submission.status || "started"}
        </span>
      </p>

      <div className="bg-gray-50 p-4 rounded-lg border mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Submission Proof</h3>

        {submission.submissionNote && (
          <p className="text-sm text-gray-600 mb-3 italic">
            "{submission.submissionNote}"
          </p>
        )}

        {submission.proofLink && (
          <div className="mb-3">
            <a
              href={submission.proofLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
            >
              🔗 View Attached Link
            </a>
          </div>
        )}

        {submission.proofFile && (
          <div>
            <p className="text-sm text-gray-500 mb-1 font-medium">
              Attached Image/File:
            </p>
            <div
              className="relative w-20 h-20 cursor-pointer group"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={submission.proofFile}
                alt="proof"
                className="w-full h-full object-cover rounded-lg border shadow-sm"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg">
                <span className="text-white text-xs font-semibold text-center leading-tight px-1">
                  View <br /> Image
                </span>
              </div>
            </div>
          </div>
        )}

        {!submission.proofLink && !submission.proofFile && (
          <p className="text-sm text-gray-500">No proof provided.</p>
        )}
      </div>

      {["submitted", "approved", "rejected"].includes(submission.status) ? (
        <div className="flex gap-3 mt-4">
          {submission.status !== "approved" && (
            <button
              onClick={() => onApprove(submission._id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
          )}

          {submission.status !== "rejected" && (
            <button
              onClick={() => onReject(submission._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          )}
        </div>
      ) : (
        <p className="mt-4 text-gray-500 font-medium">
          User has not submitted proof yet.
        </p>
      )}

      {isImageModalOpen && submission.proofFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full flex justify-center">
            <button
              className="absolute -top-10 right-0 md:right-10 text-white hover:text-gray-300 text-3xl font-bold"
              onClick={() => setIsImageModalOpen(false)}
            >
              &times;
            </button>
            <img
              src={submission.proofFile}
              alt="proof full size"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;
