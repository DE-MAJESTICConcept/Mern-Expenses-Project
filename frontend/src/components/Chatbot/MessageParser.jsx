class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Regular expressions for direct transaction commands
    // add income [amount] [description]
    const incomeRegex = /add income (\d+(\.\d{1,2})?)\s*(.*)/;
    // add expense [amount] [category] [description] - Improved regex for category capture
    // This regex tries to capture the category until it sees another number or the end of the string
    const expenseRegex = /add expense (\d+(\.\d{1,2})?)\s+([a-zA-Z\s]+?)(?:\s+(.*))?$/;

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      this.actionProvider.greet();
    } else if (lowerCaseMessage.includes("list transactions")) {
      this.actionProvider.handleListTransactions();
    } else if (lowerCaseMessage.includes("how to use")) {
      this.actionProvider.handleHowToUse();
    } else if (lowerCaseMessage.includes("budgeting advice")) {
      this.actionProvider.handleBudgetingAdvice();
    }
    // ! NEW: Handle "show balance" command
    else if (lowerCaseMessage.includes("show balance") || lowerCaseMessage.includes("what's my balance")) {
        this.actionProvider.handleShowBalance();
    }
    // Handle direct "add income" command with details
    else if (incomeRegex.test(lowerCaseMessage)) {
      const match = lowerCaseMessage.match(incomeRegex);
      const amount = parseFloat(match[1]);
      const description = match[3] ? match[3].trim() : ""; // Description can be empty
      this.actionProvider.handleAddIncomeWithDetails(amount, description);
    }
    // Handle direct "add expense" command with details
    else if (expenseRegex.test(lowerCaseMessage)) {
      const match = lowerCaseMessage.match(expenseRegex);
      const amount = parseFloat(match[1]);
      let categoryRaw = match[3] ? match[3].trim() : ""; // Raw category string
      const description = match[4] ? match[4].trim() : ""; // Description can be empty

      // Basic cleanup for category (e.g., removing trailing "category") - often not needed with better regex
      // if (categoryRaw.endsWith(" category")) {
      //   categoryRaw = categoryRaw.replace(/ category$/, "").trim();
      // }

      this.actionProvider.handleAddExpenseWithDetails(amount, categoryRaw, description);
    }
    // If only "add income" or "add expense" without details, open widget
    else if (lowerCaseMessage === "add income") {
      this.actionProvider.handleAddIncome(); // Opens the widget
    } else if (lowerCaseMessage === "add expense") {
      this.actionProvider.handleAddExpense(); // Opens the widget
    }
    else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;
