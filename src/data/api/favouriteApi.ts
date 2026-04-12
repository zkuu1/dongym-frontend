import axios from "axios";

const API = process.env.NEXT_PUBLIC_BASE_API;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// TOGGLE FAVOURITE
export const toggleFavourite = async (productId: number) => {
  try {
    const res = await axios.post(`${API}api/favourites/${productId}`, {}, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to toggle favorite");
  }
};

// CHECK FAVOURITE STATUS
export const checkFavouriteStatus = async (productId: number) => {
  try {
    const res = await axios.get(`${API}api/favourites/check/${productId}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to check favorite status");
  }
};

// GET MY FAVOURITES
export const getMyFavourites = async () => {
  try {
    const res = await axios.get(`${API}api/favourites/me`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch favorites");
  }
};
