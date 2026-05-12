import axiosInstance from "../api/axios";

/*
=====================================
JOIN QUEST
=====================================
*/
export const joinQuest = async (questId: string) => {
  const response = await axiosInstance.post("/user-quests/join", { questId });
  return response.data;
};

/*
=====================================
SUBMIT QUEST
=====================================
*/
export const submitQuest = async (userQuestId: string, formData: FormData) => {
  const response = await axiosInstance.post(
    `/user-quests/submit/${userQuestId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

/*
=====================================
MY JOINED QUESTS
=====================================
*/
export const getMyJoinedQuests = async (page = 1, limit?: number) => {
  const query = limit ? `?page=${page}&limit=${limit}` : `?page=${page}`;
  const response = await axiosInstance.get(`/user-quests/my-quests${query}`);
  return response.data;
};

/*
=====================================
LEADERBOARD
=====================================
*/
export const getLeaderboard = async (page = 1, limit?: number) => {
  const query = limit ? `?page=${page}&limit=${limit}` : `?page=${page}`;
  const response = await axiosInstance.get(`/user-quests/leaderboard${query}`);
  return response.data;
};

/*
=====================================
ADMIN - GET QUEST SUBMISSIONS
=====================================
*/
export const getQuestSubmissions = async (
  questId: string,
  page = 1,
  limit?: number,
) => {
  const query = limit ? `?page=${page}&limit=${limit}` : `?page=${page}`;
  const response = await axiosInstance.get(
    `/user-quests/submissions/${questId}${query}`,
  );
  return response.data;
};

/*
=====================================
ADMIN - APPROVE SUBMISSION
=====================================
*/
export const approveSubmission = async (submissionId: string) => {
  const response = await axiosInstance.put(
    `/user-quests/approve/${submissionId}`,
  );
  return response.data;
};

/*
=====================================
ADMIN - REJECT SUBMISSION
=====================================
*/
export const rejectSubmission = async (
  submissionId: string,
  reviewMessage: string,
) => {
  const response = await axiosInstance.put(
    `/user-quests/reject/${submissionId}`,
    { reviewMessage },
  );
  return response.data;
};
