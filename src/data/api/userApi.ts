/* ===========================
   GLOBAL AXIOS CONFIG
=========================== */
import axios from "axios";

const API = process.env.NEXT_PUBLIC_BASE_API;

/* Helper ambil token dari localStorage */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

/* Normalized Response Types */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/* ===========================
   USER API
=========================== */

// GET ALL USERS — protected
export const getAllUser = async () => {
  try {
    const res = await axios.get(`${API}api/user`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get users");
  }
};

// SEARCH USER BY ID
export const searchUserById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/user/${id}`);
    return {
      success: true,
      message: response.data?.message || "Success get user by ID",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get user by ID",
      data: null,
    };
  }
};

// SEARCH USER BY KEYWORD (name/email)
export const searchUser = async (keyword: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/user/search/${keyword}`);
    return {
      success: true,
      message: "Success search user",
      data: response.data?.data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to search user",
      data: [],
    };
  }
};

// CREATE USER (admin usage) — protected
export const createUser = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/user`, payload, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      message: response.data?.message || "User created",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

// REGISTER USER — public
export const registerUser = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/user/register`, payload);
    return {
      success: true,
      message: response.data?.message || "Registration success",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Pendaftaran gagal";
    throw new Error(apiMessage);
  }
};

// LOGIN USER — public
export const loginUser = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/user/login`, payload);
    return {
      success: true,
      message: response.data?.message || "Login success",
      data: response.data,
    };
  } catch (error: any) {
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Email atau password salah";
    throw new Error(apiMessage);
  }
};

// UPDATE USER — protected
export const updateUserById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const isFormData = payload instanceof FormData;
    const response = await axios.patch(`${API}api/user/${id}`, payload, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return {
      success: true,
      message: response.data?.message || "User updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// DELETE USER — protected
export const deleteUserById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/user/${id}`, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      message: response.data?.message || "User deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};
