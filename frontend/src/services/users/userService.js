import axiosInstance from "../../utils/axiosInstance"; // ! NEW: Import your custom axiosInstance
import { getUserFromStorage } from "../../utils/getUserFromStorage"; // Still needed for token retrieval

// Helper function to get authentication headers dynamically (still needed for specific headers not covered by interceptor if any)
// For this updated setup, this function largely becomes redundant IF all authenticated calls use axiosInstance
// and the token is correctly attached by the request interceptor.
// However, I'll keep it for clarity for now, but actual usage will simplify.
const getAuthHeaders = () => {
  const token = getUserFromStorage();
  if (!token) {
    console.warn("Authentication token not found. User might not be logged in or token expired.");
    throw new Error("Authentication required.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

//! --- User Authentication APIs ---

// Login (Does NOT use getAuthHeaders as it's for logging in and getting a token)
export const loginAPI = async ({ email, password }) => {
  try {
    // Use axiosInstance directly, it already has baseURL configured
    const response = await axiosInstance.post(`/users/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error in loginAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Register (Does NOT use getAuthHeaders)
export const registerAPI = async ({ email, password, username }) => {
  try {
    // Use axiosInstance directly
    const response = await axiosInstance.post(`/users/register`, {
      email,
      password,
      username,
    });
    return response.data;
  } catch (error) {
    console.error("Error in registerAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Change Password (uses axiosInstance, token attached by interceptor)
export const changePasswordAPI = async (newPassword) => {
  try {
    // Pass config directly, interceptor will add Authorization header
    const response = await axiosInstance.put(
      `/users/change-password`,
      { newPassword }
    );
    return response.data;
  } catch (error) {
    console.error("Error in changePasswordAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Update Profile (uses axiosInstance, token attached by interceptor)
export const updateProfileAPI = async ({ email, username }) => {
  try {
    // Pass config directly, interceptor will add Authorization header
    const response = await axiosInstance.put(
      `/users/update-profile`,
      { email, username }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateProfileAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Initiate Password Reset (typically does NOT require authentication)
export const initiatePasswordResetAPI = async (email) => {
  try {
    // Use axiosInstance directly
    const response = await axiosInstance.post(`/users/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error in initiatePasswordResetAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Reset Password API (uses token from URL, does NOT require session authentication)
export const resetPasswordAPI = async (token, newPassword) => {
  try {
    // Use axiosInstance directly
    const response = await axiosInstance.post(
      `/users/reset-password/${token}`,
      { newPassword }
    );
    return response.data;
  } catch (error) {
    console.error("Error in resetPasswordAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
