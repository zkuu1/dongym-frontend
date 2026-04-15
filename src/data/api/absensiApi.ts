import axios from "axios";

const API = process.env.NEXT_PUBLIC_BASE_API;

/* Helper ambil token dari localStorage */
const getAuthHeader = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

/* Normalized Response Types */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    meta?: any;
}

// GET ALL ABSENSI — protected (Admin Only)
export const getAllAbsensi = async (): Promise<ApiResponse<any[]>> => {
    try {
        const res = await axios.get(`${API}api/absensi`, {
            headers: getAuthHeader(),
        });
        return res.data;
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
    throw new Error(data?.message || "Failed to get absensi records");
    }
};

// GET ABSENSI ME — protected (User/Admin)
export const getAbsensiMe = async (): Promise<ApiResponse<any[]>> => {
    try {
        const res = await axios.get(`${API}api/absensi/me`, {
            headers: getAuthHeader(),
        });
        return res.data;
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
    throw new Error(data?.message || "Failed to get your absensi records");
    }
};

// CREATE ABSENSI — protected (Admin Only)
export const createAbsensi = async (payload: {
    idUser: number;
    noMember?: string;
    date: string | Date;
    status: "member" | "non member";
}): Promise<ApiResponse<any>> => {
    try {
        const response = await axios.post(`${API}api/absensi`, payload, {
            headers: getAuthHeader(),
        });
        return {
            success: true,
            message: response.data?.message || "Absensi created successfully",
            data: response.data?.data ?? null,
        };
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
        throw new Error(data?.message || "Failed to create absensi");
    }
};

// UPDATE ABSENSI — protected (Admin Only)
export const updateAbsensi = async (id: number, payload: any): Promise<ApiResponse<any>> => {
    try {
        const response = await axios.patch(`${API}api/absensi/${id}`, payload, {
            headers: getAuthHeader(),
        });
        return {
            success: true,
            message: response.data?.message || "Absensi updated successfully",
            data: response.data?.data ?? null,
        };
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
        throw new Error(data?.message || "Failed to update absensi");
    }
};

// DELETE ABSENSI — protected (Admin Only)
export const deleteAbsensi = async (id: number): Promise<ApiResponse<any>> => {
    try {
        const response = await axios.delete(`${API}api/absensi/${id}`, {
            headers: getAuthHeader(),
        });
        return {
            success: true,
            message: response.data?.message || "Absensi deleted successfully",
            data: response.data?.data ?? null,
        };
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
        throw new Error(data?.message || "Failed to delete absensi");
    }
};

// GET LEADERBOARD
export const getLeaderboard = async (): Promise<ApiResponse<any[]>> => {
    try {
        const res = await axios.get(`${API}api/absensi/leaderboard/all`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to get leaderboard");
    }
};

// GET USER RANK
export const getUserRank = async (id_user: number): Promise<ApiResponse<any>> => {
    try {
        const res = await axios.get(`${API}api/absensi/rank/${id_user}`, {
            headers: getAuthHeader(),
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to get your rank");
    }
};
