import axios from "axios";

const API = process.env.NEXT_PUBLIC_BASE_API;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// TOGGLE LIKE
export const toggleLike = async (productId: number) => {
  try {
    const res = await axios.post(`${API}api/likes/${productId}`, {}, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to toggle like");
  }
};

// CHECK LIKE STATUS
export const checkLikeStatus = async (productId: number) => {
  try {
    const res = await axios.get(`${API}api/likes/check/${productId}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to check like status");
  }
};

// GET MY LIKES
export const getMyLikes = async () => {
  try {
    const res = await axios.get(`${API}api/likes/me`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch likes");
  }
};

// GET PRODUCT LIKE COUNT
export const getProductLikeCount = async (productId: number) => {
  try {
    const res = await axios.get(`${API}api/likes/product/${productId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch like count");
  }
};
