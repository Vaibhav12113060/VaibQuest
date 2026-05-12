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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "title":
        return value.trim() === "" ? "Quest title is required." : "";
      case "description":
        return value.trim() === "" ? "Description is required." : "";
      case "rewardXP":
        if (value.toString().trim() === "") return "Reward XP is required.";
        return Number(value) < 0
          ? "Reward XP must be a non-negative number."
          : "";
      case "deadline":
        return value.trim() === "" ? "Deadline is required." : "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: Record<string, string> = {};
    let hasErrors = false;
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      validationErrors[key] = error;
      if (error) hasErrors = true;
    });

    setErrors(validationErrors);
    setTouched({
      title: true,
      description: true,
      rewardXP: true,
      deadline: true,
      difficulty: true,
      submissionType: true,
    });

    if (hasErrors) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const response = await createQuest(formData);

      toast.success(response.message);

      navigate("/admin");
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => Object.values(err)[0])
          .join(" • ");
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">Create Quest</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">
            Quest Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Learn React Basics"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border px-4 py-2 rounded-lg outline-none transition ${errors.title && touched.title ? "border-red-500 ring-1 ring-red-500" : "focus:ring-2 focus:ring-black"}`}
          />
          {errors.title && touched.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Detail what needs to be done..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border px-4 py-2 rounded-lg h-32 outline-none transition ${errors.description && touched.description ? "border-red-500 ring-1 ring-red-500" : "focus:ring-2 focus:ring-black"}`}
          />
          {errors.description && touched.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Reward XP <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="rewardXP"
              placeholder="e.g., 100"
              value={formData.rewardXP}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border px-4 py-2 rounded-lg outline-none transition ${errors.rewardXP && touched.rewardXP ? "border-red-500 ring-1 ring-red-500" : "focus:ring-2 focus:ring-black"}`}
            />
            {errors.rewardXP && touched.rewardXP && (
              <p className="text-red-500 text-sm mt-1">{errors.rewardXP}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border px-4 py-2 rounded-lg outline-none transition ${errors.deadline && touched.deadline ? "border-red-500 ring-1 ring-red-500" : "focus:ring-2 focus:ring-black"}`}
            />
            {errors.deadline && touched.deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-black transition bg-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Submission Type
            </label>
            <select
              name="submissionType"
              value={formData.submissionType}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-black transition bg-white"
            >
              <option value="link">Link</option>
              <option value="file">File</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateQuest;
