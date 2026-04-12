import Cookies from "js-cookie";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  // Check localStorage first, then cookies
  return localStorage.getItem("token") || Cookies.get("token");
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Hapus cookie token agar middleware mendeteksi logout
  Cookies.remove("token", { path: "/" });
};