import React, { useRef } from 'react';
import TransactionList from '../Transactions/TransactionList';
import TransactionChart from '../Transactions/TransactionChart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useQuery } from '@tanstack/react-query'; // ! NEW: Import useQuery
import { listCategoriesAPI } from '../../services/category/categoryService'; // ! NEW: Import category service
import { getFinancialSummaryForAdviceAPI } from '../../services/transactions/transactionService'; // ! NEW: Import transaction summary service
import AlertMessage from '../Alert/AlertMessage';

const Dashboard = () => {
  const dashboardRef = useRef(null);

  // ! NEW: Fetch categories data
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesFetchError,
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ['list-categories-for-dashboard'], // Unique query key
  });

  // ! NEW: Fetch financial summary data for insights
  const {
    data: financialSummary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryFetchError,
  } = useQuery({
    queryFn: getFinancialSummaryForAdviceAPI,
    queryKey: ['financial-summary-for-dashboard'], // Unique query key
  });

  const handleDownloadPdf = async () => {
    if (!dashboardRef.current) {
      console.error("Dashboard content ref is not attached.");
      return;
    }

    const originalText = document.getElementById('downloadButton').textContent;
    document.getElementById('downloadButton').textContent = 'Generating PDF...';
    document.getElementById('downloadButton').disabled = true;

    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for html2canvas to debug any issues
        allowTaint: true, // Allow images/data from other origins to be "tainted" on the canvas
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('financial-dashboard.pdf');

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again. Check console for details.");
    } finally {
      document.getElementById('downloadButton').textContent = originalText;
      document.getElementById('downloadButton').disabled = false;
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Financial Dashboard</h1>

        <div className="mb-6 flex justify-end">
          <button
            id="downloadButton"
            onClick={handleDownloadPdf}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            Download Dashboard (PDF)
          </button>
        </div>

        <div ref={dashboardRef} className="space-y-8 p-4 bg-white rounded-lg shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Transaction Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg col-span-full md:col-span-1">
              <TransactionChart />
            </div>

            {/* ! MODIFIED: Quick Insights Section */}
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
              
                <li className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-medium">Avg. Daily Spending (Last 30 Days):</span>
                  <span className="text-gray-800">${((financialSummary?.totalExpense || 0) / 30).toFixed(2)}</span>
                </li>
              
              </ul>
            </div>
          </div>

          {/* Transaction List */}
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
