import axiosInstance from "../api/axios";

export const handleChat = async (message: string) => {
  const response = await axiosInstance.post("/ai/chat", {
    message,
  });

  return response.data;
};
