import axiosInstance from "../api/axios";

/*
=====================================
GET ALL QUESTS
=====================================
*/
export const getAllQuests = async (page = 1, limit?: number) => {
  const query = limit ? `?page=${page}&limit=${limit}` : `?page=${page}`;
  const response = await axiosInstance.get(`/quests${query}`);
  return response.data;
};

/*
=====================================
GET QUEST BY ID
=====================================
*/
export const getQuestById = async (id: string) => {
  const response = await axiosInstance.get(`/quests/${id}`);
  return response.data;
};

/*
=====================================
CREATE QUEST (Admin)
=====================================
*/
export const createQuest = async (questData: any) => {
  const response = await axiosInstance.post("/quests/create", questData);
  return response.data;
};

/*
=====================================
UPDATE QUEST (Admin)
=====================================
*/
export const updateQuest = async (id: string, questData: any) => {
  const response = await axiosInstance.put(`/quests/update/${id}`, questData);
  return response.data;
};

/*
=====================================
DELETE QUEST (Admin)
=====================================
*/
export const deleteQuest = async (id: string) => {
  const response = await axiosInstance.delete(`/quests/delete/${id}`);
  return response.data;
};
