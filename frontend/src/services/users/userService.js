import axiosInstance from "../../utils/axiosInstance";

//! --- User Authentication APIs ---

// Login - Does NOT require an existing token
export const loginAPI = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post(`/users/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error in loginAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Register - Does NOT require an existing token
export const registerAPI = async ({ email, password, username }) => {
  try {
    const response = await axiosInstance.post(`/users/register`, { email, password, username });
    return response.data;
  } catch (error) {
    console.error("Error in registerAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Change Password - Requires authentication (token attached by interceptor)
export const changePasswordAPI = async (newPassword) => {
  try {
    const response = await axiosInstance.put(`/users/change-password`, { newPassword });
    return response.data;
  } catch (error) {
    console.error("Error in changePasswordAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Update Profile - Requires authentication (token attached by interceptor)
export const updateProfileAPI = async ({ email, username }) => {
  try {
    const response = await axiosInstance.put(`/users/update-profile`, { email, username });
    return response.data;
  } catch (error) {
    console.error("Error in updateProfileAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Initiate Password Reset - Does NOT require authentication
export const initiatePasswordResetAPI = async (email) => {
  try {
    const response = await axiosInstance.post(`/users/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error in initiatePasswordResetAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Reset Password - Does NOT require session authentication (token is in URL param)
export const resetPasswordAPI = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post(`/users/reset-password/${token}`, { newPassword });
    return response.data;
  } catch (error) {
    console.error("Error in resetPasswordAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Get User Profile - Requires authentication (token attached by interceptor)
export const getUserProfileAPI = async () => {
  try {
    const response = await axiosInstance.get(`/users/profile`);
    return response.data;
  } catch (error) {
    console.error("Error in getUserProfileAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Send Spending Report - Requires authentication (token attached by interceptor)
export const sendSpendingReportAPI = async () => {
  try {
    const response = await axiosInstance.post(`/users/send-spending-report`);
    return response.data;
  } catch (error) {
    console.error("Error in sendSpendingReportAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


// import axiosInstance from "../../utils/axiosInstance"; // Using the custom Axios instance
// // No need for direct 'axios' or 'getUserFromStorage' imports here anymore
// // as axiosInstance handles base URL, headers, and error interception.

// // Helper function to get authentication headers is now redundant if using axiosInstance for all authenticated calls.
// // The request interceptor in axiosInstance automatically adds the Authorization header.

// //! --- User Authentication APIs ---

// // Login - Does NOT require an existing token
// export const loginAPI = async ({ email, password }) => {
//   try {
//     const response = await axiosInstance.post(`/users/login`, { email, password });
//     return response.data;
//   } catch (error) {
//     console.error("Error in loginAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// // Register - Does NOT require an existing token
// export const registerAPI = async ({ email, password, username }) => {
//   try {
//     const response = await axiosInstance.post(`/users/register`, { email, password, username });
//     return response.data;
//   } catch (error) {
//     console.error("Error in registerAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! Change Password - Requires authentication (token attached by interceptor)
// export const changePasswordAPI = async (newPassword) => {
//   try {
//     const response = await axiosInstance.put(`/users/change-password`, { newPassword });
//     return response.data;
//   } catch (error) {
//     console.error("Error in changePasswordAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! Update Profile - Requires authentication (token attached by interceptor)
// export const updateProfileAPI = async ({ email, username }) => {
//   try {
//     const response = await axiosInstance.put(`/users/update-profile`, { email, username });
//     return response.data;
//   } catch (error) {
//     console.error("Error in updateProfileAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! Initiate Password Reset - Does NOT require authentication
// export const initiatePasswordResetAPI = async (email) => {
//   try {
//     const response = await axiosInstance.post(`/users/forgot-password`, { email });
//     return response.data;
//   } catch (error) {
//     console.error("Error in initiatePasswordResetAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! Reset Password - Does NOT require session authentication (token is in URL param)
// export const resetPasswordAPI = async (token, newPassword) => {
//   try {
//     const response = await axiosInstance.post(`/users/reset-password/${token}`, { newPassword });
//     return response.data;
//   } catch (error) {
//     console.error("Error in resetPasswordAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! Get User Profile - Requires authentication (token attached by interceptor)
// export const getUserProfileAPI = async () => {
//   try {
//     const response = await axiosInstance.get(`/users/profile`);
//     return response.data;
//   } catch (error) {
//     console.error("Error in getUserProfileAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };

// //! NEW: Send Spending Report - Requires authentication (token attached by interceptor)
// export const sendSpendingReportAPI = async () => {
//   try {
//     const response = await axiosInstance.post(`/users/send-spending-report`);
//     return response.data;
//   } catch (error) {
//     console.error("Error in sendSpendingReportAPI:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };
