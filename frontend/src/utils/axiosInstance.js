// src/utils/axiosInstance.js
import axios from 'axios';
import { BASE_URL } from './url'; // Ensure this path is correct
import { getUserFromStorage } from './getUserFromStorage'; // Ensure this path is correct

// Create a custom Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // ! MODIFIED: Increased timeout to 15 seconds (from 5 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getUserFromStorage(); // Get the latest token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.error("401 Unauthorized: Token expired or invalid. Logging out...");
      // Clear local storage
      localStorage.removeItem("userInfo");
      // Redirect to login page
      window.location.href = '/login'; // Adjust '/login' to your actual login route

      // Return a rejected promise to stop further processing for this request
      return Promise.reject(new Error("Token expired or invalid. Please login again."));
    }
    // For other errors, just pass them down
    return Promise.reject(error);
  }
);

export default axiosInstance;
