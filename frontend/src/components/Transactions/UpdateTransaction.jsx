import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSingleTransactionAPI,
  updateTransactionAPI,
} from '../../services/transactions/transactionService'; // ! IMPORTANT: Ensure correct imports
import { listCategoriesAPI } from '../../services/category/categoryService'; // ! IMPORTANT: Ensure correct imports
import AlertMessage from '../Alert/AlertMessage';
// No direct 'axios' import needed here

const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for form data
  const [formData, setFormData] = useState({
    type: '',
    category: '', // Should be category ID from backend if storing IDs
    description: '',
    amount: '',
    date: '',
  });

  // State for showing confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 1. Fetch the single transaction data for pre-filling the form
  const {
    data: transaction,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
    error: transactionError
  } = useQuery({
    queryFn: () => getSingleTransactionAPI(id), // Use the imported API function
    queryKey: ['transaction', id],
    enabled: !!id,
  });

  // 2. Fetch categories for the dropdown
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError
  } = useQuery({
    queryFn: listCategoriesAPI, // Use the imported API function
    queryKey: ['list-categories'],
  });

  // Effect to populate form data once the transaction is fetched
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || '',
        category: transaction.category?._id || transaction.category || '',
        description: transaction.description || '',
        amount: transaction.amount || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
      });
    }
  }, [transaction]);

  // 3. Mutation for updating the transaction
  const {
    mutate: updateMutation,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError
  } = useMutation({
    mutationFn: (data) => updateTransactionAPI(id, data), // Use the imported API function
    onSuccess: () => {
      queryClient.invalidateQueries(['transaction', id]);
      queryClient.invalidateQueries(['list-transactions']);
      setShowConfirmation(true);
    },
    onError: (err) => {
      console.error("Error updating transaction:", err);
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    if (!formData.type) {
      alert("Please select a transaction type (income/expense).");
      return;
    }
    if (!formData.category) {
      alert("Please select a category.");
      return;
    }
    if (!formData.date) {
      alert("Please select a date.");
      return;
    }

    updateMutation(formData);
  };

  // --- Render Loading/Error States ---
  if (isTransactionLoading || isCategoriesLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        Loading transaction details...
      </div>
    );
  }

  if (isTransactionError || isCategoriesError) {
    return (
      <div className="text-red-600 text-center mt-8 p-4 bg-red-100 border border-red-400 rounded-md">
        Error loading data: {transactionError?.response?.data?.message || categoriesError?.response?.data?.message || transactionError?.message || categoriesError?.message || "An unexpected error occurred."}
      </div>
    );
  }

  // --- Custom Confirmation Modal ---
  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <h3 className="text-xl font-bold text-green-600 mb-4">Success!</h3>
        <p className="text-gray-700 mb-6">Transaction updated successfully.</p>
        <button
          onClick={() => {
            setShowConfirmation(false);
            navigate('/dashboard');
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {showConfirmation && <ConfirmationModal />}

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Update Transaction
        </h2>
        {isUpdating && <AlertMessage type="loading" message="Updating transaction..." />}
        {isUpdateError && (
          <AlertMessage
            type="error"
            message={updateError?.response?.data?.message || updateError?.message || "Failed to update transaction. Please try again."}
          />
        )}
        {isUpdateSuccess && (
          <AlertMessage type="success" message="Transaction updated successfully!" />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 50.00"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categoriesData?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Monthly salary, Groceries"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${
              isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isUpdating ? 'Updating...' : 'Update Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTransaction;
