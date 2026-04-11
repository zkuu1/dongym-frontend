/* ===========================
   CATEGORY API
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
}

// GET ALL CATEGORIES — public
export const getAllCategory = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/category`);
    return {
      success: true,
      message: response.data?.message || "Success get all categories",
      data: response.data?.data ?? [],
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get categories");
  }
};

// GET CATEGORY BY ID — public
export const getCategoryById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/category/${id}`);
    return {
      success: true,
      message: response.data?.message || "Success get category by ID",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get category by ID",
      data: null,
    };
  }
};

// CREATE CATEGORY — protected
export const createCategory = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/category`, payload, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      message: response.data?.message || "Category created",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create category");
  }
};

// UPDATE CATEGORY — protected
export const updateCategoryById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/category/${id}`, payload, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      message: response.data?.message || "Category updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update category");
  }
};

// DELETE CATEGORY — protected
export const deleteCategoryById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/category/${id}`, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      message: response.data?.message || "Category deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete category");
  }
};
