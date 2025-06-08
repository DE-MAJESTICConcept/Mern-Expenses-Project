const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction");


const transactionController = {
  //! Add Transaction
  create: asyncHandler(async (req, res) => {
    const { amount, type, category: categoryId, date, description } = req.body;
    if (!amount || !type || !categoryId || !date) {
      res.status(400);
      throw new Error("Amount, type, category, and date are required.");
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      res.status(400);
      throw new Error("Amount must be a positive number.");
    }

    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      res.status(400);
      throw new Error("Invalid transaction type: Must be 'income' or 'expense'.");
    }

    // Find the category to ensure it exists and belongs to the user
    const category = await Category.findOne({ _id: categoryId, user: req.user });
    if (!category) {
      res.status(404);
      throw new Error("Category not found or does not belong to the user.");
    }

    // Check if the category type matches the transaction type
    if (category.type.toLowerCase() !== type.toLowerCase()) {
      res.status(400);
      throw new Error(`Category type '${category.type}' does not match transaction type '${type}'.`);
    }

    const transaction = await Transaction.create({
      user: req.user,
      amount,
      type,
      category: category._id, // Store the category's ObjectId
      date,
      description,
    });
    res.status(201).json(transaction);
  }),

  //! List Transactions (existing code, ensure it's here)
  lists: asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Authentication required to list transactions.");
    }

    const { startDate, endDate, type, category } = req.query;
    const query = { user: req.user };

    if (startDate) {
      query.date = { ...query.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      query.date = { ...query.date, $lte: new Date(endDate) };
    }
    if (type) {
      query.type = type.toLowerCase();
    }
    // If a category name string is passed directly, search for its ID
    if (category) {
        const foundCategory = await Category.findOne({ name: category, user: req.user });
        if (foundCategory) {
            query.category = foundCategory._id; // Filter by category ID
        } else {
            // If category name provided but not found, return empty or specific error
            return res.status(200).json([]);
        }
    }


    const transactions = await Transaction.find(query).populate('category').sort({ date: -1 }); // Populate category details
    res.status(200).json(transactions);
  }),

  //! Get Single Transaction (existing code)
  getSingleTransaction: asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Authentication required to view transaction.");
    }
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user }).populate('category');
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found or unauthorized.");
    }
    res.status(200).json(transaction);
  }),

  //! Update Transaction (existing code)
  update: asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Authentication required to update transaction.");
    }

    const { id } = req.params;
    const { amount, type, category: categoryId, date, description } = req.body;

    const transaction = await Transaction.findOne({ _id: id, user: req.user });
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found or unauthorized.");
    }

    // Optional: Validate category if provided
    let updatedCategory = transaction.category;
    if (categoryId) {
        const newCat = await Category.findOne({ _id: categoryId, user: req.user });
        if (!newCat) {
            res.status(404);
            throw new Error("Provided category not found or unauthorized.");
        }
        if (newCat.type.toLowerCase() !== (type || transaction.type).toLowerCase()) {
            res.status(400);
            throw new Error(`New category type '${newCat.type}' does not match transaction type.`);
        }
        updatedCategory = newCat._id;
    }

    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = updatedCategory;
    transaction.date = date || transaction.date;
    transaction.description = description || transaction.description;

    await transaction.save({ runValidators: true });
    res.status(200).json(transaction);
  }),

  //! Delete Transaction (existing code)
  delete: asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Authentication required to delete transaction.");
    }
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found or unauthorized.");
    }
    res.status(200).json({ message: "Transaction deleted successfully." });
  }),

  // ! NEW: Get Financial Summary for Chatbot Advice (Ensuring correct definition)
  getFinancialSummaryForAdvice: asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      // Removed 'new' before Error in the previous line, as it was redundant.
      throw new Error("Authentication required to get financial summary.");
    }

    // Get transactions for the authenticated user for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
      user: req.user,
      date: { $gte: thirtyDaysAgo } // Filter for last 30 days
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        totalExpense += transaction.amount;
      }
    });

    res.status(200).json({
      totalIncome: totalIncome,
      totalExpense: totalExpense,
      balance: totalIncome - totalExpense,
      period: "last 30 days" // Inform the frontend about the period
    });
  }),
};

module.exports = transactionController;








