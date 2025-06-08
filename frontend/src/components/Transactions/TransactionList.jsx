import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaEdit, FaSave, FaTimesCircle } from "react-icons/fa"; // Added Save and TimesCircle icons
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  listTransactionsAPI,
  deleteTransactionAPI,
  updateTransactionAPI, // Ensure updateTransactionAPI is imported
} from "../../services/transactions/transactionService";
import { listCategoriesAPI } from "../../services/category/categoryService";
// No useNavigate import needed if we are not navigating away

const TransactionList = () => {
  const queryClient = useQueryClient();

  //! Filtering state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    category: "",
  });

  //! State for inline editing
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [editedFormData, setEditedFormData] = useState({
    type: "",
    category: "", // Will store category _id
    description: "",
    amount: "",
    date: "",
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);


  //! Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Fetching categories
  const {
    data: categoriesData,
    isLoading: categoryLoading,
    error: categoryErr,
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  // Fetching transactions based on filters
  const {
    data: transactions,
    isError,
    isLoading,
    error,
    refetch, // Keep refetch if you want to manually trigger, though invalidateQueries is preferred
  } = useQuery({
    queryFn: () => listTransactionsAPI(filters),
    queryKey: ["list-transactions", filters],
  });

  //! ----- Delete Transaction Mutation -----
  const {
    mutate: deleteTransactionMutate,
    isPending: isDeleting,
    // error: deleteError, // Not directly used in render, but useful for debugging
  } = useMutation({
    mutationFn: deleteTransactionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["list-transactions"]);
      console.log("Transaction deleted successfully!");
      setShowDeleteConfirmation(false); // Close confirmation modal
    },
    onError: (err) => {
      console.error("Error deleting transaction:", err);
      alert(`Failed to delete transaction: ${err.response?.data?.message || err.message}`);
      setShowDeleteConfirmation(false); // Close confirmation modal even on error
    },
  });

  //! ----- Update Transaction Mutation -----
  const {
    mutate: updateTransactionMutate,
    isPending: isUpdating,
    // error: updateError, // Not directly used in render, but useful for debugging
  } = useMutation({
    mutationFn: ({ id, data }) => updateTransactionAPI(id, data), // Mutation function expects an object {id, data}
    onSuccess: () => {
      queryClient.invalidateQueries(["list-transactions"]); // Invalidate and refetch transactions
      setEditingTransactionId(null); // Exit editing mode
      console.log("Transaction updated successfully!");
      // Optionally, show a success message
    },
    onError: (err) => {
      console.error("Error updating transaction:", err);
      alert(`Failed to update transaction: ${err.response?.data?.message || err.message}`);
    },
  });

  //! Handle Delete Confirmation
  const confirmDelete = (transactionId) => {
    setTransactionToDeleteId(transactionId);
    setShowDeleteConfirmation(true);
  };

  const executeDelete = () => {
    if (transactionToDeleteId) {
      deleteTransactionMutate(transactionToDeleteId);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTransactionToDeleteId(null);
  };

  //! Handle Edit Click (sets editing mode)
  const handleEditClick = (transaction) => {
    setEditingTransactionId(transaction._id);
    setEditedFormData({
      type: transaction.type,
      category: transaction.category?._id || transaction.category, // Pre-fill with category ID if object, else name
      description: transaction.description,
      amount: transaction.amount,
      date: new Date(transaction.date).toISOString().split('T')[0], // Format date for input type="date"
    });
  };

  //! Handle changes in the inline edit form
  const handleEditedFormChange = (e) => {
    const { name, value } = e.target;
    setEditedFormData((prev) => ({ ...prev, [name]: value }));
  };

  //! Handle saving the edited transaction
  const handleSaveEdit = () => {
    // Basic validation
    if (!editedFormData.amount || isNaN(editedFormData.amount) || parseFloat(editedFormData.amount) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    if (!editedFormData.type) {
      alert("Please select a transaction type (income/expense).");
      return;
    }
    if (!editedFormData.category) {
      alert("Please select a category.");
      return;
    }
    if (!editedFormData.date) {
      alert("Please select a date.");
      return;
    }

    updateTransactionMutate({ id: editingTransactionId, data: editedFormData });
  };

  //! Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingTransactionId(null);
    setEditedFormData({
      type: "",
      category: "",
      description: "",
      amount: "",
      date: "",
    });
  };

  // --- Custom Confirmation Modal Component ---
  const ConfirmationModal = ({ message, onConfirm, onCancel, isProcessing }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`font-bold py-2 px-4 rounded ${isProcessing ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
          >
            {isProcessing ? 'Processing...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  // --- Render Loading/Error States ---
  if (isLoading || categoryLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        Loading transactions and categories...
      </div>
    );
  }

  if (isError || categoryErr) {
    return (
      <div className="text-red-600 text-center mt-8 p-4 bg-red-100 border border-red-400 rounded-md">
        Error loading data: {error?.message || categoryErr?.message || "An unexpected error occurred."}
      </div>
    );
  }

  return (
    <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
      {showDeleteConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this transaction? This action cannot be undone."
          onConfirm={executeDelete}
          onCancel={cancelDelete}
          isProcessing={isDeleting}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Start Date Filter */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        {/* End Date Filter */}
        <input
          value={filters.endDate}
          onChange={handleFilterChange}
          type="date"
          name="endDate"
          className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        {/* Type Filter */}
        <div className="relative">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={handleFilterChange}
            name="category"
            className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
          >
            <option value="All">All Categories</option>
            <option value="Uncategorized">Uncategorized</option>
            {categoriesData?.map((category) => (
              <option key={category?._id} value={category?._id}> {/* Changed value to category._id */}
                {category?.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="p-4 shadow-lg rounded-lg bg-gray-50">
        <div className="mt-6 p-4 rounded-lg shadow-inner bg-white">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Filtered Transactions
            {isDeleting && <span className="ml-2 text-sm text-red-500">Deleting...</span>}
            {isUpdating && <span className="ml-2 text-sm text-blue-500">Updating...</span>}
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {transactions?.length > 0 ? (
              transactions.map((transaction) => (
                <li
                  key={transaction._id}
                  className="bg-white p-3 rounded-md shadow border border-gray-200 flex justify-between items-center flex-wrap" // Added flex-wrap
                >
                  {editingTransactionId === transaction._id ? (
                    // --- Inline Edit Form ---
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                      {/* Date */}
                      <input
                        type="date"
                        name="date"
                        value={editedFormData.date}
                        onChange={handleEditedFormChange}
                        className="p-2 border rounded-md"
                      />
                      {/* Type */}
                      <select
                        name="type"
                        value={editedFormData.type}
                        onChange={handleEditedFormChange}
                        className="p-2 border rounded-md"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                      {/* Category */}
                      <select
                        name="category"
                        value={editedFormData.category}
                        onChange={handleEditedFormChange}
                        className="p-2 border rounded-md"
                      >
                        {/* Ensure categoriesData is loaded before mapping */}
                        {categoriesData?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {/* Amount */}
                      <input
                        type="number"
                        name="amount"
                        value={editedFormData.amount}
                        onChange={handleEditedFormChange}
                        className="p-2 border rounded-md"
                        placeholder="Amount"
                      />
                      {/* Description */}
                      <input
                        type="text"
                        name="description"
                        value={editedFormData.description}
                        onChange={handleEditedFormChange}
                        className="p-2 border rounded-md col-span-1 md:col-span-2 lg:col-span-1" // Allows it to span
                        placeholder="Description"
                      />
                      <div className="flex space-x-2 justify-end col-span-full mt-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={isUpdating}
                          className={`bg-green-500 hover:bg-green-600 text-white p-2 rounded-md flex items-center gap-1 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <FaSave /> {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center gap-1"
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // --- Display Mode ---
                    <>
                      <div className="flex-grow"> {/* Added flex-grow */}
                        <span className="font-medium text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </span>
                        <span className="ml-2 text-gray-800">
                          {transaction.category?.name || transaction.category || 'Uncategorized'} - ${transaction.amount?.toLocaleString()}
                        </span>
                        {transaction.description && (
                          <span className="text-sm text-gray-600 italic ml-2">
                            ({transaction.description})
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-3 mt-2 md:mt-0"> {/* Added responsive margin-top */}
                        <button
                          onClick={() => handleEditClick(transaction)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(transaction._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center">No transactions found for the selected filters.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;






















// import React, { useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { FaTrash, FaEdit } from "react-icons/fa";

// import { ChevronDownIcon } from "@heroicons/react/24/solid";
// import { listTransactionsAPI } from "../../services/transactions/transactionService";
// import { listCategoriesAPI } from "../../services/category/categoryService";

// const TransactionList = () => {
//   //!Filtering state
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     type: "",
//     category: "",
//   });
//   //!Handle Filter Change
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   //fetching
//   const {
//     data: categoriesData,
//     isLoading: categoryLoading,
//     error: categoryErr,
//   } = useQuery({
//     queryFn: listCategoriesAPI,
//     queryKey: ["list-categories"],
//   });
//   //fetching
//   const {
//     data: transactions,
//     isError,
//     isLoading,
//     isFetched,
//     error,
//     refetch,
//   } = useQuery({
//     queryFn: () => listTransactionsAPI(filters),
//     queryKey: ["list-transactions", filters],
//   });

//   return (
//     <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {/* Start Date */}
//         <input
//           type="date"
//           name="startDate"
//           value={filters.startDate}
//           onChange={handleFilterChange}
//           className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//         />
//         {/* End Date */}
//         <input
//           value={filters.endDate}
//           onChange={handleFilterChange}
//           type="date"
//           name="endDate"
//           className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//         />
//         {/* Type */}
//         <div className="relative">
//           <select
//             name="type"
//             value={filters.type}
//             onChange={handleFilterChange}
//             className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
//           >
//             <option value="">All Types</option>
//             <option value="income">Income</option>
//             <option value="expense">Expense</option>
//           </select>
//           <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
//         </div>
//         {/* Category */}
//         <div className="relative">
//           <select
//             value={filters.category}
//             onChange={handleFilterChange}
//             name="category"
//             className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
//           >
//             <option value="All">All Categories</option>
//             <option value="Uncategorized">Uncategorized</option>
//             {categoriesData?.map((category) => {
//               return (
//                 <option key={category?._id} value={category?.name}>
//                   {category?.name}
//                 </option>
//               );
//             })}
//           </select>
//           <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
//         </div>
//       </div>
//       <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
//         {/* Inputs and selects for filtering (unchanged) */}
//         <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800">
//             Filtered Transactions
//           </h3>
//           <ul className="list-disc pl-5 space-y-2">
//             {transactions?.map((transaction) => (
//               <li
//                 key={transaction._id}
//                 className="bg-white p-3 rounded-md shadow border border-gray-200 flex justify-between items-center"
//               >
//                 <div>
//                   <span className="font-medium text-gray-600">
//                     {new Date(transaction.date).toLocaleDateString()}
//                   </span>
//                   <span
//                     className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       transaction.type === "income"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {transaction.type.charAt(0).toUpperCase() +
//                       transaction.type.slice(1)}
//                   </span>
//                   <span className="ml-2 text-gray-800">
//                     {transaction.category?.name} - $
//                     {transaction.amount.toLocaleString()}
//                   </span>
//                   <span className="text-sm text-gray-600 italic ml-2">
//                     {transaction.description}
//                   </span>
//                 </div>
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={() => handleUpdateTransaction(transaction._id)}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(transaction._id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionList;
