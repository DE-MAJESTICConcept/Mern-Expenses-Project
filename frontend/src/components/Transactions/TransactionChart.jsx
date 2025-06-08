import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getFinancialSummaryForAdviceAPI } from '../../services/transactions/transactionService'; // ! IMPORTANT: Import the API function
import AlertMessage from '../Alert/AlertMessage'; // Assuming you have an AlertMessage component

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionChart = () => {
  // Use React Query to fetch financial summary data
  const {
    data: summaryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: getFinancialSummaryForAdviceAPI, // Use the API function directly
    queryKey: ['financialSummary'],
  });

  // Prepare chart data once summaryData is available
  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [summaryData?.totalIncome || 0, summaryData?.totalExpense || 0],
        backgroundColor: ['#36A2EB', '#FF6384'], // Blue for Income, Pink for Expense
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Position legend below the chart
        labels: {
          font: {
            size: 14,
            family: 'Inter, sans-serif',
          },
          color: '#333', // Darker color for legend labels
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    },
  };


  // --- Render Loading/Error States ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <AlertMessage type="loading" message="Loading transaction overview..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-40">
        <AlertMessage
          type="error"
          message={error?.response?.data?.message || error?.message || "Error loading data: An unexpected error occurred."}
        />
      </div>
    );
  }

  // If no data (e.g., first login, no transactions), show a message
  if (!summaryData || (summaryData.totalIncome === 0 && summaryData.totalExpense === 0)) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-center">
        No transaction data available to display chart. Add some transactions!
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Transaction Overview</h2>
      <div className="h-64 w-full flex justify-center items-center"> {/* Set a fixed height for the chart */}
        <Doughnut data={chartData} options={chartOptions} />
      </div>
      <div className="flex justify-around items-center mt-6 text-lg font-semibold">
        <div className="flex flex-col items-center">
          <span className="text-blue-600">Income</span>
          <span className="text-gray-800">${summaryData.totalIncome.toFixed(2)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-pink-600">Expense</span>
          <span className="text-gray-800">${summaryData.totalExpense.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;
