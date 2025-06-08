import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

// Helper function to get authentication headers dynamically
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

//! Add Transaction
export const addTransactionAPI = async (transactionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/transactions/create`, transactionData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in addTransactionAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! List Transactions
export const listTransactionsAPI = async (filters = {}) => {
  try {
    const { startDate, endDate, type, category } = filters;
    const queryString = new URLSearchParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(type && { type }),
      ...(category && { category }),
    }).toString();

    const url = `${BASE_URL}/transactions/lists${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in listTransactionsAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Get Single Transaction
export const getSingleTransactionAPI = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in getSingleTransactionAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Update Transaction
export const updateTransactionAPI = async (id, transactionData) => {
  try {
    const response = await axios.put(`${BASE_URL}/transactions/${id}`, transactionData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in updateTransactionAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Delete Transaction
export const deleteTransactionAPI = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/transactions/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in deleteTransactionAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ! NEW: Get Financial Summary for Advice
export const getFinancialSummaryForAdviceAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions/summary-for-advice`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in getFinancialSummaryForAdviceAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

