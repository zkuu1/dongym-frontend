/* ===========================
   GLOBAL AXIOS CONFIG
=========================== */
import axios from "axios";

const API = process.env.NEXT_PUBLIC_BASE_API;

/* Normalized Response Types */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/* ===========================
   USER API
=========================== */

// GET ALL USERS
export const getAllUser = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(`${API}api/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res)

    return res.data;

  } catch (error: any) {
    console.log("FULL ERROR:", error);
  console.log("ERROR RESPONSE:", error.response);
  console.log("ERROR DATA:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to get product");
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
    console.error("searchUserById ERROR:", error.response?.status, error.response?.data);
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


// CREATE USER / register
export const createUser = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/user/register`, payload);
    return {
      success: true,
      message: response.data?.message || "User created",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

export const loginUser = async (payload: any): Promise<ApiResponse<any>> => {
    try {
        const response = await axios.post(`${API}api/user/login`, payload);
        return {
            success: true,
            message: response.data?.message,
            data: response.data
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message)
    }
}



// UPDATE USER
export const updateUserById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/user/update/${id}`, payload);
    return {
      success: true,
      message: response.data?.message || "User updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// DELETE USER
export const deleteUserById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/user/delete/${id}`);
    return {
      success: true,
      message: response.data?.message || "User deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};



