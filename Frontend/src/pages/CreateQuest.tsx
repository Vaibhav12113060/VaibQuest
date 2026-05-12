import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { createQuest } from "../services/quest.service";
import toast from "react-hot-toast";

const CreateQuest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rewardXP: "",
    deadline: "",
    difficulty: "easy",
    submissionType: "link",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createQuest(formData);

      toast.success(response.message);

      navigate("/admin");
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
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">Create Quest</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Quest Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded h-32"
        />

        <input
          type="number"
          name="rewardXP"
          placeholder="Reward XP"
          value={formData.rewardXP}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          name="submissionType"
          value={formData.submissionType}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="link">Link</option>
          <option value="file">File</option>
          <option value="both">Both</option>
        </select>

        <button type="submit" className="bg-black text-white px-5 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateQuest;
