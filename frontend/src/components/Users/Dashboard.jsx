
import React, { useRef } from 'react';
import TransactionList from '../Transactions/TransactionList';
import TransactionChart from '../Transactions/TransactionChart';
// import html2canvas from 'html2canvas'; // ! REMOVED: PDF download logic removed
// import jsPDF from 'jspdf'; // ! REMOVED: PDF download logic removed
import { useQuery } from '@tanstack/react-query';
import { listCategoriesAPI } from '../../services/category/categoryService';
import { getFinancialSummaryForAdviceAPI } from '../../services/transactions/transactionService';
import AlertMessage from '../Alert/AlertMessage';
// import axiosInstance from '../../utils/axiosInstance'; // ! REMOVED: PDF download logic removed (Keep if other parts of Dashboard use it)

const Dashboard = () => {
  // Correctly initialize useRef hooks inside the component
  const dashboardRef = useRef(null);
  // pdfRef is not strictly needed if download logic is removed, but if you keep it:
  // const pdfRef = useRef(null); // Initialized correctly inside the component

  // Placeholder function for the download button
  const handleDownloadPdfPlaceholder = () => {
    alert("PDF download feature is currently unavailable or under development.");
    // Or simply do nothing:
    // console.log("Download PDF button clicked (functionality removed)");
  };

  // Fetch categories data
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesFetchError,
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ['list-categories-for-dashboard'],
  });

  // Fetch financial summary data for insights
  const {
    data: financialSummary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryFetchError,
  } = useQuery({
    queryFn: getFinancialSummaryForAdviceAPI,
    queryKey: ['financial-summary-for-dashboard'],
  });

  // Calculate total number of categories
  const totalCategories = categoriesData?.length || 0;

  // Render loading/error states for insights
  if (categoriesLoading || summaryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <AlertMessage type="loading" message="Loading dashboard insights..." />
      </div>
    );
  }

  if (categoriesError || summaryError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <AlertMessage
          type="error"
          message={
            categoriesFetchError?.response?.data?.message ||
            summaryFetchError?.response?.data?.message ||
            "Failed to load dashboard insights."
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"> {/* Removed ref=(pdfRef) here */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Financial Dashboard</h1>

        <div className="mb-6 flex justify-end">
          <button
            id="downloadButton"
            onClick={handleDownloadPdfPlaceholder} {/* Call the placeholder function */}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            Download Dashboard (PDF)
          </button>
        </div>

        {/* This is the content area for your dashboard */}
        <div ref={dashboardRef} className="space-y-8 p-4 bg-white rounded-lg shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg col-span-full md:col-span-1">
              <TransactionChart />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg col-span-full md:col-span-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Insights</h3>
              <ul className="text-gray-700 space-y-3">
                <li className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-medium">Total Categories:</span>
                  <span className="text-blue-600">{totalCategories}</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-medium">Total Income (Last 30 Days):</span>
                  <span className="text-green-600">${financialSummary?.totalIncome.toFixed(2) || '0.00'}</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-medium">Total Expenses (Last 30 Days):</span>
                  <span className="text-red-600">${financialSummary?.totalExpense.toFixed(2) || '0.00'}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-bold">Net Balance (Last 30 Days):</span>
                  <span className={`font-bold ${financialSummary && financialSummary.balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    ${financialSummary?.balance.toFixed(2) || '0.00'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <TransactionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

 

// import React from "react";

// import TransactionChart from "../Transactions/TransactionChart";
// import TransactionList from "../Transactions/TransactionList";

// const Dashboard = () => {
//   return (
//     <>
//       <TransactionChart />
//       <TransactionList />
//     </>
//   );
// };

// export default Dashboard;
