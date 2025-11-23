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
   USER API
=========================== */

// GET ALL USERS
export const getAllUser = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/users`);
    return {
      success: true,
      message: response.data?.message || "Success get all users",
      data: response.data?.data || [],
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get users");
  }
};

// SEARCH USER BY ID
export const searchUserById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/users/${id}`);

    return {
      success: true,
      message: response.data?.message || "Success get user by ID",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    console.error("❌ searchUserById ERROR:", error.response?.status, error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get user by ID",
      data: null,
    };
  }
};

// SEARCH USER BY KEYWORD (name/email)
export const searchUser = async (keyword: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/users/search/${keyword}`);

    return {
      success: true,
      message: "Success search user",
      data: response.data?.data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to search user",
      data: [],
    };
  }
};


// CREATE USER
export const createUser = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/users/register`, payload);
    return {
      success: true,
      message: response.data?.message || "User created",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

// UPDATE USER
export const updateUserById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/users/update/${id}`, payload);
    return {
      success: true,
      message: response.data?.message || "User updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// DELETE USER
export const deleteUserById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/users/delete/${id}`);
    return {
      success: true,
      message: response.data?.message || "User deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};



/* ===========================
   PRODUCT API
=========================== */

// GET ALL PRODUCTS
export const getAllProduct = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/products`);
    return {
      success: true,
      message: response.data?.message || "Success get products",
      data: response.data?.data || [],
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get products");
  }
};

// CREATE PRODUCT
export const createProduct = async (
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/products`, payload);
    return {
      success: true,
      message: response.data?.message || "Product created",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
};

// SEARCH PRODUCT BY ID
export const searchProductById = async (
  id: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/products/${id}`);
    return {
      success: true,
      message: response.data?.message || "Success search product",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to search product");
  }
};

// UPDATE PRODUCT BY ID
export const updateProductById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/products/${id}`, payload);
    return {
      success: true,
      message: response.data?.message || "Product updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};

// DELETE PRODUCT BY ID
export const deleteProductById = async (
  id: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/products/${id}`);
    return {
      success: true,
      message: response.data?.message || "Product deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete product");
  }
};



/* ===========================
   ABSENSI API
=========================== */

// GET ALL ABSENSI
export const getAllAbsensi = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/absensi`);
    return {
      success: true,
      message: response.data?.message || "Success get absensi",
       data: response.data?.data || []
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get absensi");
  }
};

// CREATE ABSENSI
export const createAbsensi = async (
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${API}api/absensi`, payload);
    return {
      success: true,
      message: response.data?.message || "Absensi created",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create absensi");
  }
};

// SEARCH ABSENSI BY ID
export const searchAbsensiById = async (
  id: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/absensi/${id}`);
    return {
      success: true,
      message: response.data?.message || "Success search absensi",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to search absensi");
  }
};

// UPDATE ABSENSI BY ID
export const updateAbsensiById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/absensi/update/${id}`, payload);
    return {
      success: true,
      message: response.data?.message || "Absensi updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update absensi");
  }
};

// DELETE ABSENSI BY ID
export const deleteAbsensiById = async (
  id: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/absensi/${id}`);
    return {
      success: true,
      message: response.data?.message || "Absensi deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete absensi");
  }
};



/* ===========================
   CATEGORY API
=========================== */

// GET ALL CATEGORY
export const getAllCategory = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/categories`);
    return {
      success: true,
      message: response.data?.message || "Success get categories",
      data: response.data?.data || [],
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get category");
  }
};

// SEARCH CATEGORY BY ID
export const searchCategoryById = async (
  id: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API}api/categories/${id}`);
    return {
      success: true,
      message: response.data?.message || "Success search category",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to search category"
    );
  }
};

// UPDATE CATEGORY
export const updateCategoryById = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API}api/categories/${id}`, payload);
    return {
      success: true,
      message: response.data?.message || "Category updated",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update category");
  }
};

// DELETE CATEGORY
export const deleteCategoryById = async (
  id: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API}api/categories/${id}`);
    return {
      success: true,
      message: response.data?.message || "Category deleted",
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete category");
  }
};
