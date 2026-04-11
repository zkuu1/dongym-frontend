/* ===========================
   MEMBERSHIP API
=========================== */
import axios from "axios";

const API = process.env.NEXT_PUBLIC_BASE_API;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// GET ALL MEMBERSHIPS — protected
export const getAllMembership = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/membership`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join(" | ");
      throw new Error(`${data.message || "Validasi Error"}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to get memberships");
  }
};

// GET MEMBERSHIP BY ID — protected
export const getMembershipById = async (id: string | number): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/membership/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join(" | ");
      throw new Error(`${data.message || "Validasi Error"}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to get membership by ID");
  }
};

// CREATE MEMBERSHIP — protected
export const createMembership = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/membership`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join(" | ");
      throw new Error(`${data.message || "Validasi Error"}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to create membership");
  }
};

// UPDATE MEMBERSHIP — protected
export const updateMembershipById = async (
  id: string | number,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/membership/${id}`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join(" | ");
      throw new Error(`${data.message || "Validasi Error"}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to update membership");
  }
};

// DELETE MEMBERSHIP — protected
export const deleteMembershipById = async (id: string | number): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/membership/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join(" | ");
      throw new Error(`${data.message || "Validasi Error"}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to delete membership");
  }
};
