// src/components/Dashboard/Dashboard.jsx
import React, { useRef } from 'react';
import TransactionList from '../Transactions/TransactionList';
import TransactionChart from '../Transactions/TransactionChart';
import html2canvas from 'html2canvas'; // Still needed to capture frontend HTML
// import jsPDF from 'jspdf'; // ! REMOVED: No longer needed for frontend PDF generation
import { useQuery } from '@tanstack/react-query';
import { listCategoriesAPI } from '../../services/category/categoryService';
import { getFinancialSummaryForAdviceAPI } from '../../services/transactions/transactionService';
import AlertMessage from '../Alert/AlertMessage';
import axiosInstance from '../../utils/axiosInstance'; // ! NEW: Import axiosInstance for backend call

const Dashboard = () => {
  const dashboardRef = useRef(null);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesFetchError,
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ['list-categories-for-dashboard'],
  });

  const {
    data: financialSummary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryFetchError,
  } = useQuery({
    queryFn: getFinancialSummaryForAdviceAPI,
    queryKey: ['financial-summary-for-dashboard'],
  });

  // ! MODIFIED: Function to send HTML to backend for PDF download
  const handleDownloadPdf = async () => {
    if (!dashboardRef.current) {
      console.error("Dashboard content ref is not attached.");
      return;
    }

    const downloadButton = document.getElementById('downloadButton');
    const originalText = downloadButton.textContent;
    downloadButton.textContent = 'Generating PDF...';
    downloadButton.disabled = true;

    try {
      // Step 1: Capture the HTML content of the dashboard
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2, // Higher scale for better resolution
        useCORS: true, // Allow cross-origin images if any (though usually not an issue for local content)
        logging: true, // Enable logging for debugging html2canvas issues
        allowTaint: true, // Allow tainting the canvas if images are from different origins
        // Optional: specific CSS to ignore for html2canvas to avoid rendering issues
        // ignoreElements: (element) => element.classList.contains('do-not-print'),
      });

      // Get the captured HTML as a string
      // html2canvas produces a canvas. We convert the canvas to an image and then embed it.
      // For more complex HTML, you might consider sending the raw HTML string from the DOM,
      // but rendering through canvas usually captures applied styles better.
      // However, if the issue persists with chart rendering, you might need to try sending raw HTML.
      // For simplicity and to leverage html2canvas for style capture, we convert the canvas to HTML.

      // A simple way to get HTML string (though not perfectly preserving rendered state):
      const clonedElement = dashboardRef.current.cloneNode(true);
      // Remove the download button from the cloned element to avoid it in the PDF
      const buttonToRemove = clonedElement.querySelector('#downloadButton');
      if (buttonToRemove) {
        buttonToRemove.remove();
      }
      // Add necessary external CSS links for Puppeteer if it needs them
      // You'll need to know the public URL of your App.css or other global CSS files
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = 'https://mern-expenses-project-frontend.onrender.com/src/App.css'; // ! IMPORTANT: Replace with your deployed frontend URL for App.css
      clonedElement.prepend(styleLink);

      // Add Tailwind JIT styles if needed (Puppeteer needs the actual CSS)
      // This part is tricky. If Tailwind is JIT compiling, Puppeteer won't see it
      // unless you include the compiled CSS. The App.css include should cover it.
      // Or, ideally, your backend Puppeteer environment has Tailwind styles somehow.

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Financial Dashboard Report</title>
          <!-- Link to your compiled CSS on the deployed frontend -->
          <link rel="stylesheet" href="https://mern-expenses-project-frontend.onrender.com/src/App.css">
          <style>
             /* Add any crucial inline styles here that are missing or causing issues */
             /* For example, if html2canvas needs specific colors rendered a certain way */
             /* This is a fallback if the main App.css linking isn't sufficient */
             body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; }
             /* Force colors html2canvas might struggle with if not explicitly in App.css */
             .bg-blue-600 { background-color: #2563eb !important; }
             .text-white { color: #ffffff !important; }
             /* Ensure Doughnut chart renders correctly (it's an image in PDF usually) */
             canvas { max-width: 100% !important; height: auto !important; }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div style="padding: 20px;">
            ${clonedElement.innerHTML}
          </div>
        </body>
        </html>
      `;

      // Step 2: Send the HTML content to your backend for PDF generation
      const response = await axiosInstance.post('/users/generate-pdf-report', { htmlContent }, {
        responseType: 'blob', // Important: Expect a binary blob (PDF) response
      });

      // Step 3: Create a Blob from the response and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial-dashboard-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF. Please ensure backend is running and check console for details.`);
    } finally {
      downloadButton.textContent = originalText;
      downloadButton.disabled = false;
    }
  };

  // Calculate total number of categories
  const totalCategories = categoriesData?.length || 0;

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

        {/* This is the content that will be converted to PDF */}
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
