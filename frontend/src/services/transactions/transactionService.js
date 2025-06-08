import axiosInstance from "../../utils/axiosInstance"; // Using the custom Axios instance
// No need for direct 'axios' or 'getUserFromStorage' imports here anymore

//! Add Transaction
export const addTransactionAPI = async (transactionData) => {
  try {
    const response = await axiosInstance.post(`/transactions/create`, transactionData);
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

    const url = `/transactions/lists${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in listTransactionsAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Get Single Transaction
export const getSingleTransactionAPI = async (id) => {
  try {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getSingleTransactionAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Update Transaction
export const updateTransactionAPI = async (id, transactionData) => {
  try {
    const response = await axiosInstance.put(`/transactions/${id}`, transactionData);
    return response.data;
  } catch (error) {
    console.error("Error in updateTransactionAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Delete Transaction
export const deleteTransactionAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteTransactionAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//! Get Financial Summary for Advice
export const getFinancialSummaryForAdviceAPI = async () => {
  try {
    const response = await axiosInstance.get(`/transactions/summary-for-advice`);
    return response.data;
  } catch (error) {
    console.error("Error in getFinancialSummaryForAdviceAPI:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
