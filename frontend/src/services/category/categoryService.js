// import axiosInstance from "../../utils/axiosInstance";

// //! Add Category
// export const addCategoryAPI = async (categoryData) => {
//   try {
//     const response = await axiosInstance.post(`/categories/create`, categoryData);
//     return response.data;
//   } catch (error) {
//     console.error("Error in addCategoryAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! List Categories
// export const listCategoriesAPI = async (filters = {}) => {
//   try {
//     const queryString = new URLSearchParams(filters).toString();
//     const url = `/categories/lists${queryString ? `?${queryString}` : ''}`;
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     console.error("Error in listCategoriesAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! Get Single Category
// export const getSingleCategoryAPI = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/categories/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error in getSingleCategoryAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! Update Category
// export const updateCategoryAPI = async (id, categoryData) => {
//   try {
//     const response = await axiosInstance.put(`/categories/${id}`, categoryData);
//     return response.data;
//   } catch (error) {
//     console.error("Error in updateCategoryAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! Delete Category
// export const deleteCategoryAPI = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/categories/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error in deleteCategoryAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };



import axiosInstance from "../../utils/axiosInstance"; // Using the custom Axios instance

//! Add Category
export const addCategoryAPI = async (categoryData) => {
  try {
    const response = await axiosInstance.post(`/categories/create`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error in addCategoryAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! List Categories
export const listCategoriesAPI = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const url = `/categories/lists${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in listCategoriesAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Get Single Category
export const getSingleCategoryAPI = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getSingleCategoryAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Update Category
export const updateCategoryAPI = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error in updateCategoryAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Delete Category
export const deleteCategoryAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteCategoryAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
