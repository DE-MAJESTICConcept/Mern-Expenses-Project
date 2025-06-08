import React from 'react';
import { getFinancialSummaryForAdviceAPI, addTransactionAPI } from '../../services/transactions/transactionService';
import { listCategoriesAPI } from '../../services/category/categoryService';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage, stateRef) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef; // Reference to the current state of the chatbot

    // Bind methods to this context
    this.greet = this.greet.bind(this);
    this.handleListTransactions = this.handleListTransactions.bind(this);
    this.handleHowToUse = this.handleHowToUse.bind(this);
    this.handleAddIncome = this.handleAddIncome.bind(this); // For opening widget
    this.handleAddExpense = this.handleAddExpense.bind(this); // For opening widget
    this.handleAddIncomeWithDetails = this.handleAddIncomeWithDetails.bind(this); // For direct input
    this.handleAddExpenseWithDetails = this.handleAddExpenseWithDetails.bind(this); // For direct input
    this.handleBudgetingAdvice = this.handleBudgetingAdvice.bind(this);
    this.handleUnknown = this.handleUnknown.bind(this);
    this.generateAdvice = this.generateAdvice.bind(this);
    this.handleShowBalance = this.handleShowBalance.bind(this); // Bind new method
  }

  // Helper to update the chatbot state with new messages
  updateChatbotState(message) {
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }

  // ! NEW: General function to generate and display advice
  async generateAdvice(userQuery) {
    try {
      // Show thinking message for advice generation
      this.updateChatbotState(this.createChatBotMessage("Analyzing your habits for advice..."));

      const summary = await getFinancialSummaryForAdviceAPI();
      const totalIncome = summary.totalIncome;
      const totalExpense = summary.totalExpense;
      const balance = summary.balance;
      const period = summary.period;

      let prompt = `The user just made a request related to financial transactions: "${userQuery}".\n`;
      prompt += `Based on their recent financial activity (${period}):\n`;
      prompt += `- Total Income: $${totalIncome.toFixed(2)}\n`;
      prompt += `- Total Expenses: $${totalExpense.toFixed(2)}\n`;
      prompt += `- Net Balance: $${balance.toFixed(2)}\n\n`;
      prompt += `Please provide a short, insightful, and actionable financial advice related to their spending/saving habits based on this data. Tailor the advice to be positive and encouraging, even if the balance is negative. Focus on actionable tips related to their spending patterns. For example, if expenses are high, suggest reviewing categories. If income is significantly higher, suggest saving or investing. If the balance is negative, offer gentle advice on identifying areas to cut back. Keep it concise, 2-3 sentences max.`;

      const apiKey = "AIzaSyDd_Tuv76uvlCtQEG0Bd826GorGSKoyhlo"; // Keep this empty; Canvas will provide it
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      let adviceText = "I don't have specific advice right now, but keep tracking your transactions!";
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        adviceText = result.candidates[0].content.parts[0].text;
      }

      const adviceMessage = this.createChatBotMessage(`📈 Financial Insight: ${adviceText}`);
      this.updateChatbotState(adviceMessage);

    } catch (error) {
      console.error("Error generating advice:", error);
      const errorMessage = this.createChatBotMessage("I had trouble generating advice. Please try again later or ensure you are logged in.");
      this.updateChatbotState(errorMessage);
    }
  }

  // ! NEW: Handle "show balance" command
  async handleShowBalance() {
    this.updateChatbotState(this.createChatBotMessage("Fetching your financial summary..."));
    try {
      const summary = await getFinancialSummaryForAdviceAPI();
      const message = this.createChatBotMessage(
        `Your balance for the last ${summary.period} is:
         Income: $${summary.totalIncome.toFixed(2)}
         Expenses: $${summary.totalExpense.toFixed(2)}
         Net Balance: $${summary.balance.toFixed(2)}`
      );
      this.updateChatbotState(message);
      this.generateAdvice("showing balance"); // Generate advice after showing balance
    } catch (error) {
      console.error("Error fetching balance:", error);
      this.updateChatbotState(this.createChatBotMessage("I couldn't retrieve your financial summary. Please ensure you are logged in."));
    }
  }


  // --- Existing Chatbot Handlers ---
  greet() {
    const message = this.createChatBotMessage("Hello there! How can I assist you with your finances today?");
    this.updateChatbotState(message);
    // Removed direct call to generateAdvice here, as QuickReplies widget is now shown by config.js
    // The QuickReplies themselves will trigger relevant ActionProvider methods.
  }

  handleHowToUse() {
    // ! MODIFIED: Removed widget as QuickReplies cover this functionality
    const message = this.createChatBotMessage(
      "You can interact with me using the quick reply buttons, or type commands like 'add income [amount] [description]', 'add expense [amount] [category] [description]', 'list transactions', or 'show balance'."
    );
    this.updateChatbotState(message);
    this.generateAdvice("asking how to use the bot"); // Still generate advice
  }

  handleListTransactions() {
    const loadingMessage = this.createChatBotMessage("Fetching your transactions...");
    this.updateChatbotState(loadingMessage);

    const message = this.createChatBotMessage("Here are your recent transactions:", {
      widget: "transactionList",
    });
    this.updateChatbotState(message);
    this.generateAdvice("listing transactions");
  }

  handleAddIncome() {
    const message = this.createChatBotMessage(
      "Okay, I can help you add income. What is the amount and a short description?",
      { widget: "addIncome" }
    );
    this.updateChatbotState(message);
    this.generateAdvice("preparing to add income");
  }

  handleAddExpense() {
    const message = this.createChatBotMessage(
      "To add an expense, please tell me the amount, category (e.g., 'Food', 'Rent'), and a description.",
      { widget: "addExpense" }
    );
    this.updateChatbotState(message);
    this.generateAdvice("preparing to add expense");
  }

  async handleAddIncomeWithDetails(amount, description) {
    this.updateChatbotState(this.createChatBotMessage("Adding your income..."));
    try {
      const categories = await listCategoriesAPI();
      const incomeCategory = categories.find(cat => cat.type === 'income' && cat.name.toLowerCase() === 'uncategorized income') ||
                             categories.find(cat => cat.type === 'income');

      let categoryId = incomeCategory ? incomeCategory._id : null;

      if (!categoryId) {
        this.updateChatbotState(this.createChatBotMessage("I couldn't find an 'income' category. Please add one in your dashboard first (e.g., 'Uncategorized Income')."));
        return;
      }

      const transactionData = {
        amount: amount,
        type: "income",
        category: categoryId,
        date: new Date().toISOString().split('T')[0],
        description: description || "Added via chatbot",
      };
      await addTransactionAPI(transactionData);
      this.updateChatbotState(this.createChatBotMessage(`✅ Income of $${amount.toFixed(2)} added successfully!`));
      this.generateAdvice("added income");
    } catch (error) {
      console.error("Error adding income:", error);
      this.updateChatbotState(this.createChatBotMessage("❌ Failed to add income. Please ensure you are logged in and have an 'income' category."));
    }
  }

  async handleAddExpenseWithDetails(amount, categoryRaw, description) {
    this.updateChatbotState(this.createChatBotMessage(`Adding your expense for ${categoryRaw}...`));
    try {
      const categories = await listCategoriesAPI();
      const normalizedCategoryRaw = categoryRaw.toLowerCase();

      // Find the category by name and type 'expense'
      const foundCategory = categories.find(
        (cat) => cat.name.toLowerCase() === normalizedCategoryRaw && cat.type === 'expense'
      );

      let categoryId = null;

      if (foundCategory) {
        categoryId = foundCategory._id;
      } else {
        // Fallback to "Uncategorized" if the provided category name doesn't exist for expenses
        const uncategorized = categories.find(
          (cat) => cat.name.toLowerCase() === "uncategorized" && cat.type === 'expense'
        );
        if (uncategorized) {
          categoryId = uncategorized._id;
          this.updateChatbotState(this.createChatBotMessage(`Category "${categoryRaw}" not found. Adding expense to "Uncategorized" category.`));
        } else {
          this.updateChatbotState(this.createChatBotMessage("Category not found and no 'Uncategorized' expense category exists. Please add this category in your dashboard first."));
          return;
        }
      }

      const transactionData = {
        amount: amount,
        type: "expense",
        category: categoryId,
        date: new Date().toISOString().split('T')[0],
        description: description || `Chatbot expense: ${categoryRaw}`,
      };

      await addTransactionAPI(transactionData);
      this.updateChatbotState(this.createChatBotMessage(`✅ Expense of $${amount.toFixed(2)} for "${categoryRaw}" added successfully!`));
      this.generateAdvice("added expense");
    } catch (error) {
      console.error("Error adding expense:", error);
      this.updateChatbotState(this.createChatBotMessage("❌ Failed to add transaction. Please ensure you are logged in and have categories set up."));
    }
  }


  handleBudgetingAdvice() {
    const message = this.createChatBotMessage("Here is some general budgeting advice: A common rule of thumb is the 50/30/20 rule, where 50% of your income goes to needs, 30% to wants, and 20% to savings/debt repayment.");
    this.updateChatbotState(message);
    this.generateAdvice("requesting budgeting advice");
  }

  handleUnknown() {
    const message = this.createChatBotMessage("I'm not sure how to respond to that. You can ask me to 'add income', 'add expense', 'list transactions', 'show balance', or 'how to use'.");
    this.updateChatbotState(message);
    this.generateAdvice("unknown command");
  }
}

export default ActionProvider;
