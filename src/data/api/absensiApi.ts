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
        throw new Error(error.response?.data?.message || "Failed to get absensi records");
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
        throw new Error(error.response?.data?.message || "Failed to get your absensi records");
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
        const message = error.response?.data?.message || "Failed to create absensi";
        throw new Error(message);
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
        throw new Error(error.response?.data?.message || "Failed to update absensi");
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
        throw new Error(error.response?.data?.message || "Failed to delete absensi");
    }
};
