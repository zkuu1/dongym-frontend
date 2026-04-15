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

// GET ALL COMMENTS — public
export const getAllComments = async (page = 1, limit = 10): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/comments`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => {
          const value = Array.isArray(val) ? val.join(", ") : val;
          return key === 'general' ? value : `${key}: ${value}`;
        })
        .join(" | ");
      const message = data.message || "Validasi Error";
      throw new Error(detail.includes(message) ? detail : `${message}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to get all comments");
  }
};

// GET COMMENTS BY PRODUCT — public
export const getCommentsByProduct = async (idProduct: string | number): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/comments/product/${idProduct}`);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => {
          const value = Array.isArray(val) ? val.join(", ") : val;
          return key === 'general' ? value : `${key}: ${value}`;
        })
        .join(" | ");
      const message = data.message || "Validasi Error";
      throw new Error(detail.includes(message) ? detail : `${message}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to get product comments");
  }
};

// GET USER COMMENTS — public
export const getUserComments = async (idUser: string | number): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/comments/user/${idUser}`);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => {
          const value = Array.isArray(val) ? val.join(", ") : val;
          return key === 'general' ? value : `${key}: ${value}`;
        })
        .join(" | ");
      const message = data.message || "Validasi Error";
      throw new Error(detail.includes(message) ? detail : `${message}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to get user comments");
  }
};

// GET MY COMMENTS (HISTORY) — protected
export const getMyComments = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/comments/me`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => {
          const value = Array.isArray(val) ? val.join(", ") : val;
          return key === 'general' ? value : `${key}: ${value}`;
        })
        .join(" | ");
      const message = data.message || "Validasi Error";
      throw new Error(detail.includes(message) ? detail : `${message}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to get your comments");
  }
};

// CREATE COMMENT ON PRODUCT — protected
export const createComment = async (idProduct: string | number, payload: { comment: string }): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/comments/${idProduct}`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => {
          const value = Array.isArray(val) ? val.join(", ") : val;
          return key === 'general' ? value : `${key}: ${value}`;
        })
        .join(" | ");
      const message = data.message || "Validasi Error";
      throw new Error(detail.includes(message) ? detail : `${message}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to create comment");
  }
};

// UPDATE COMMENT — protected
export const updateComment = async (id: string | number, payload: { comment: string }): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/comments/${id}`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => {
          const value = Array.isArray(val) ? val.join(", ") : val;
          return key === 'general' ? value : `${key}: ${value}`;
        })
        .join(" | ");
      const message = data.message || "Validasi Error";
      throw new Error(detail.includes(message) ? detail : `${message}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to update comment");
  }
};

// DELETE COMMENT — protected
export const deleteComment = async (id: string | number): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/comments/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (data?.errors) {
      const detail = Object.entries(data.errors)
        .map(([key, val]) => {
          const value = Array.isArray(val) ? val.join(", ") : val;
          return key === 'general' ? value : `${key}: ${value}`;
        })
        .join(" | ");
      const message = data.message || "Validasi Error";
      throw new Error(detail.includes(message) ? detail : `${message}: ${detail}`);
    }
    throw new Error(data?.message || "Failed to delete comment");
  }
};
