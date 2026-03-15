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
   product API
=========================== */

// GET ALL productS
export const getAllProduct = async () => {
  try {
    const res = await axios.get(`${API}api/product`, { timeout: 10000 }); // 10 detik timeout
    console.log(res);
    return res.data;
  } catch (error: any) {
    console.log("FULL ERROR:", error);
    console.log("ERROR RESPONSE:", error.response);
    console.log("ERROR DATA:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to get products");
  }
};

// SEARCH product BY ID
export const searchProductById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/product/${id}`);

    return {
      success: true,
      message: response.data?.message || "Success get product by ID",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    console.error("searchproductById ERROR:", error.response?.status, error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get product by ID",
      data: null,
    };
  }
};

// SEARCH product BY KEYWORD (name/email)
export const searchProduct = async (keyword: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/product/search/${keyword}`);

    return {
      success: true,
      message: "Success search product",
      data: response.data?.data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to search product",
      data: [],
    };
  }
};


// CREATE product / register
export const createProduct = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/product`, payload);
    return {
      success: true,
      message: response.data?.message || "product created",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
};


// UPDATE product
export const updateProductById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/product/update/${id}`, payload);
    return {
      success: true,
      message: response.data?.message || "product updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};

// DELETE product
export const deleteproductById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/product/delete/${id}`);
    return {
      success: true,
      message: response.data?.message || "product deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete product");
  }
};



