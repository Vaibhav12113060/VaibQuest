import { useState } from "react";
import { submitQuest } from "../services/userQuest.service"; // Assuming this service function exists
import toast from "react-hot-toast";

interface SubmitQuestProps {
  userQuestId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SubmitQuest = ({ userQuestId, onClose, onSuccess }: SubmitQuestProps) => {
  const [submissionNote, setSubmissionNote] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofLink && !proofFile) {
      toast.error("Please provide a proof link or upload a file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("submissionNote", submissionNote);
    formData.append("proofLink", proofLink);
    if (proofFile) {
      formData.append("proofFile", proofFile);
    }

    try {
      const response = await submitQuest(userQuestId, formData);
      toast.success(response.message);
      onSuccess();
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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-xl"
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold mb-6">Submit Quest Proof</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Submission Note (optional)"
            value={submissionNote}
            onChange={(e) => setSubmissionNote(e.target.value)}
            className="w-full border px-4 py-2 rounded h-24"
          />
          <input
            type="text"
            placeholder="Proof Link (e.g., GitHub, Drive)"
            value={proofLink}
            onChange={(e) => setProofLink(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <div>
            <label className="block mb-1 font-medium text-sm">
              Or Upload a File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded px-4 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition disabled:bg-gray-500"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitQuest;
