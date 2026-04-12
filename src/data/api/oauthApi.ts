import axios from "axios";

const API = process.env.NEXT_PUBLIC_BASE_API;

// logic handle google oauth
export const googleAuthCallback = async () => {
  try {
    const response = await axios.get(`${API}api/auth/google/callback`);
    return {
      success: true,
      message: response.data?.message || "Login success",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Google OAuth failed",
      data: null,
    };
  }
};

// logic login with google
export const loginWithGoogle = () => {
  if (typeof window !== "undefined") {
    window.location.href = `${API}api/auth/google`;
  }
};
