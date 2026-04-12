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

// GET ALL PRODUCTS — public
export const getAllProduct = async () => {
  try {
    const res = await axios.get(`${API}api/product`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get products");
  }
};

// GET PRODUCT BY ID — public
export const searchProductById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/product/${id}`);
    return {
      success: true,
      message: response.data?.message || "Success get product by ID",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get product by ID",
      data: null,
    };
  }
};

// SEARCH PRODUCT BY KEYWORD — public
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

// CREATE PRODUCT — protected
export const createProduct = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/product`, payload, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      message: response.data?.message || "Product created",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
};

// UPDATE PRODUCT — protected
export const updateProductById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/product/${id}`, payload, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      message: response.data?.message || "Product updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};

// DELETE PRODUCT — protected
export const deleteProductById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/product/${id}`, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      message: response.data?.message || "Product deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete product");
  }
};
