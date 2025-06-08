// src/components/Chatbot/widgets/QuickReplies.jsx
import React from 'react';

const QuickReplies = (props) => {
  // Define your quick reply options
  const options = [
    { text: "Add Income", handler: () => props.actionProvider.handleAddIncome() },
    { text: "Add Expense", handler: () => props.actionProvider.handleAddExpense() },
    { text: "List Transactions", handler: () => props.actionProvider.handleListTransactions() },
    { text: "Show Balance", handler: () => props.actionProvider.handleShowBalance() },
    { text: "Budgeting Advice", handler: () => props.actionProvider.handleBudgetingAdvice() },
    { text: "How to Use", handler: () => props.actionProvider.handleHowToUse() },
  ];

  return (
    <div className="react-chatbot-kit-chat-bot-message-container"> {/* Use existing container style */}
      <div className="react-chatbot-kit-chat-btn-container"> {/* Use existing button container style */}
        {options.map((option, index) => (
          <button
            key={index}
            className="react-chatbot-kit-chat-btn" // Use existing button style
            onClick={option.handler}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
