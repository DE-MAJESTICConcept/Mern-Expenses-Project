import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listTransactionsAPI } from '../../../services/transactions/transactionService';
import { listCategoriesAPI } from '../../../services/category/categoryService';

// Ensure this log appears!
console.log("TransactionListWidget.jsx: Component function is being executed!");

const TransactionListWidget = ({ payload }) => {
  const filterType = payload?.filterType || 'all';

  console.log("TransactionListWidget: Rendered with filterType:", filterType);

  // Fetch all transactions from the backend
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isError: transactionsError,
    error: transactionsFetchError,
  } = useQuery({
    queryFn: () => listTransactionsAPI({}), // This call is what fetches data
    queryKey: ['list-transactions'], // This query key must be consistent with ActionProvider's invalidate
  });

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesFetchError, // Capture category error too
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ['list-categories'],
  });

  // --- DEBUGGING LOGS ---
  useEffect(() => {
    console.log("TransactionListWidget Effect:");
    console.log("  transactionsLoading:", transactionsLoading);
    console.log("  transactionsError:", transactionsError ? transactionsFetchError : null);
    console.log("  transactionsData:", transactionsData);
    console.log("  categoriesLoading:", categoriesLoading);
    console.log("  categoriesError:", categoriesError ? categoriesFetchError : null);
    console.log("  categoriesData:", categoriesData);
  }, [
    transactionsLoading, transactionsError, transactionsData, transactionsFetchError,
    categoriesLoading, categoriesError, categoriesData, categoriesFetchError // Added categoriesFetchError
  ]);
  // --- END DEBUGGING LOGS ---

  if (transactionsLoading || categoriesLoading) {
    return (
      <div className="chatbot-widget-container loading">
        <p>Loading financial data...</p>
      </div>
    );
  }

  if (transactionsError || categoriesError) {
    const errorDetail = transactionsFetchError?.response?.data?.message || categoriesFetchError?.response?.data?.message || "Unknown error";
    return (
      <div className="chatbot-widget-container error">
        <p>Error loading data: {errorDetail}. Check console for details.</p>
      </div>
    );
  }

  const allTransactions = Array.isArray(transactionsData) ? transactionsData : [];

  let displayTransactions = [];
  let title = "";
  let totalIncome = 0;
  let totalExpenses = 0;
  let currentBalance = 0;

  totalIncome = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  totalExpenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  currentBalance = totalIncome - totalExpenses;

  console.log("TransactionListWidget: Calculated Totals:", { totalIncome, totalExpenses, currentBalance });

  if (filterType === 'expense') {
    displayTransactions = allTransactions.filter(t => t.type === 'expense');
    title = "Your Expenses:";
  } else if (filterType === 'income') {
    displayTransactions = allTransactions.filter(t => t.type === 'income');
    title = "Your Income:";
  } else if (filterType === 'report') {
    return (
      <div className="chatbot-widget-container report-summary">
        <h3>Financial Report Summary:</h3>
        <p><strong>Total Income:</strong> ${totalIncome.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}</p>
        <p><strong>Net Balance:</strong> ${currentBalance.toFixed(2)}</p>
      </div>
    );
  } else if (filterType === 'balanceOnly') {
    return (
      <div className="chatbot-widget-container report-summary">
        <p><strong>Your Current Balance:</strong> ${currentBalance.toFixed(2)}</p>
      </div>
    );
  } else { // 'all' transactions
    displayTransactions = allTransactions;
    title = "All Your Transactions:";
  }

  console.log("TransactionListWidget: Filtered Display Data (length):", displayTransactions.length);

  if (displayTransactions.length === 0) {
    return (
      <div className="chatbot-widget-container no-data">
        <p>No {filterType !== 'all' && filterType !== 'report' && filterType !== 'balanceOnly' ? filterType : ''} transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="chatbot-widget-container transaction-list-widget">
      <h3>{title}</h3>
      <ul className="transaction-ul">
        {displayTransactions.map((transaction) => {
          const categoryName = categoriesData?.find(cat => cat._id === transaction.category)?.name || transaction.category || 'N/A';
          return (
            <li key={transaction._id || transaction.id} className="transaction-li">
              <span className="transaction-date">[{new Date(transaction.date).toLocaleDateString()}]</span>
              <span className={`transaction-amount ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
                ${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
              </span>
              <span className="transaction-category-source">
                {categoryName}
              </span>
              {transaction.description && (
                <span className="transaction-description">
                  ({transaction.description})
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TransactionListWidget;

