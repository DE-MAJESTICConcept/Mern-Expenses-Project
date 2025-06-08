import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

// Helper function to get authentication headers dynamically (for authenticated APIs)
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

// Login
export const loginAPI = async ({ email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error in loginAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Register
export const registerAPI = async ({ email, password, username }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, { email, password, username });
    return response.data;
  } catch (error) {
    console.error("Error in registerAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Change Password (requires authentication)
export const changePasswordAPI = async (newPassword) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/change-password`, { newPassword }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in changePasswordAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Update Profile (requires authentication)
export const updateProfileAPI = async ({ email, username }) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/update-profile`, { email, username }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in updateProfileAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Initiate Password Reset (does NOT require authentication)
export const initiatePasswordResetAPI = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error in initiatePasswordResetAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! NEW: Reset Password API (uses token from URL, does NOT require session authentication)
export const resetPasswordAPI = async (token, newPassword) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/reset-password/${token}`, // Endpoint will include the token
      { newPassword } // Send the new password in the body
    );
    return response.data;
  } catch (error) {
    console.error("Error in resetPasswordAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};







