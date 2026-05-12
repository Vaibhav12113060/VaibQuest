import axiosInstance from "../api/axios";

/*
=====================================
REGISTER USER
=====================================
*/

export const registerUser = async (userData: any) => {
  const response = await axiosInstance.post("/auth/register", userData);

  return response.data;
};

/*
=====================================
LOGIN USER
=====================================
*/

export const loginUser = async (userData: any) => {
  const response = await axiosInstance.post("/auth/login", userData);

  return response.data;
};

/*
=====================================
GET CURRENT USER
=====================================
*/

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");

  return response.data;
};

/*
=====================================
GET MY PROFILE
=====================================
*/

export const getMyProfile = async () => {
  const response = await axiosInstance.get("/auth/profile");

  return response.data;
};

/*
=====================================
CHANGE PROFILE PICTURE
=====================================
*/

export const changeProfilePicture = async (formData: FormData) => {
  const response = await axiosInstance.put(
    "/auth/profile/change-avatar",
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
CHANGE PASSWORD
=====================================
*/

export const changePassword = async (passwordData: any) => {
  const response = await axiosInstance.put(
    "/auth/profile/change-password",
    passwordData,
  );

  return response.data;
};

/*
=====================================
ADMIN - GET ALL USERS
=====================================
*/

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/auth/users");

  return response.data;
};

/*
=====================================
ADMIN - GET USER PROFILE
=====================================
*/

export const getUserProfileByAdmin = async (userId: string) => {
  const response = await axiosInstance.get(`/auth/user/${userId}`);

  return response.data;
};
