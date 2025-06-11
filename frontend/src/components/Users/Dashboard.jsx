// src/components/Dashboard/Dashboard.jsx
import React, { useRef } from 'react';
import TransactionList from '../Transactions/TransactionList';
import TransactionChart from '../Transactions/TransactionChart';
import html2canvas from 'html2canvas'; // ! Keep: Needed to capture frontend HTML
// import jsPDF from 'jspdf'; // ! REMOVED: PDF generation is now backend-driven
import { useQuery } from '@tanstack/react-query';
import { listCategoriesAPI } from '../../services/category/categoryService';
import { getFinancialSummaryForAdviceAPI } from '../../services/transactions/transactionService';
import AlertMessage from '../Alert/AlertMessage';
import axiosInstance from '../../utils/axiosInstance'; // ! Keep: Needed for backend API call

const Dashboard = () => {
  const dashboardRef = useRef(null); // Ref to the main dashboard content div

  // ! MODIFIED: Function to capture HTML and send to backend for PDF download
  const handleDownloadPdf = async () => {
    if (!dashboardRef.current) {
      console.error("Dashboard content ref is not attached.");
      alert("Error: Dashboard content not found for PDF generation.");
      return;
    }

    const downloadButton = document.getElementById('downloadButton');
    const originalText = downloadButton.textContent;
    downloadButton.textContent = 'Generating PDF...';
    downloadButton.disabled = true;

    try {
      // Step 1: Capture the HTML content of the dashboard.
      // html2canvas helps in capturing the *rendered* state, including charts.
      // We are essentially taking a "screenshot" of the HTML portion.
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2, // Higher scale for better resolution in the PDF
        useCORS: true, // Allow loading cross-origin images/resources if present
        logging: true, // Enable logging for debugging html2canvas issues
        allowTaint: true, // Allow tainting the canvas for cross-origin content (e.g., Google Charts)
      });

      // Convert the canvas to an image data URL
      const imgData = canvas.toDataURL('image/png');

      // Step 2: Construct a full HTML string that Puppeteer on the backend can render.
      // This includes the captured image and necessary CSS for overall page layout.
      // It's crucial to link to your *deployed* App.css for Puppeteer to find it.
      // Replace 'https://mern-expenses-project-frontend.onrender.com/src/App.css' with YOUR actual deployed frontend URL.
      const htmlContentForBackend = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Financial Dashboard Report</title>
          <link rel="stylesheet" href="https://mern-expenses-project-frontend.onrender.com/src/App.css">
          <style>
             body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background-color: #f5f7fa; }
             /* Basic styling for the image within the PDF */
             .pdf-image {
                 max-width: 100%;
                 height: auto;
                 display: block; /* Ensures it takes its own line */
                 margin: 0 auto; /* Center the image */
                 box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Optional: add a subtle shadow */
             }
             /* Ensure Doughnut chart renders correctly within the image */
             canvas { max-width: 100% !important; height: auto !important; }
             /* Hide the download button itself in the PDF capture */
             #downloadButton { display: none !important; }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <h1 style="text-align: center; color: #1f2937; margin-bottom: 20px;">Your Financial Dashboard</h1>
          <img src="${imgData}" class="pdf-image" alt="Financial Dashboard Overview" />
          <p style="text-align: center; color: #6b7280; font-size: 0.9em; margin-top: 30px;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </p>
        </body>
        </html>
      `;

      // Step 3: Send the HTML content to your backend for PDF generation
      const response = await axiosInstance.post('/users/generate-pdf-report', { htmlContent: htmlContentForBackend }, {
        responseType: 'blob', // Important: Expect a binary blob (PDF) response
      });

      // Step 4: Create a Blob from the response and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial-dashboard-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click(); // Programmatically click the link to trigger download
      link.parentNode.removeChild(link); // Clean up the temporary link
      window.URL.revokeObjectURL(url); // Revoke the temporary URL

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF. Please ensure backend is running and check console for details.`);
    } finally {
      // Restore button state
      downloadButton.textContent = originalText;
      downloadButton.disabled = false;
    }
  };

  // Fetch categories data for Quick Insights
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesFetchError,
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ['list-categories-for-dashboard'],
  });

  // Fetch financial summary data for Quick Insights
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

        {/* This is the content area that will be captured for the PDF */}
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
