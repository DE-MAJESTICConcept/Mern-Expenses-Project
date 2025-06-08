// routes/chatbotRouter.js
const express = require('express');
const User = require('../model/User'); // Assuming you have a User model
const Transaction = require('../model/Transaction'); // Assuming you have a Transaction model
const isAuthenticated = require('../middlewares/isAuth.js'); // Your authentication middleware
const sendEmail = require('../utils/emailSender'); // We'll create this utility

const chatbotRouter = express.Router();

chatbotRouter.post('/api/chatbot-report', isAuthenticated, async (req, res) => {
  const { query } = req.body;
  const userId = req.user.id; // User ID from your isAuthenticated middleware

  let responseMessage = "I'm sorry, I can only provide financial reports and summaries right now. Please try typing 'report' or 'summary'.";
  let reportData = null;
  let emailSent = false;
  
  try {
    const lowerCaseQuery = query.toLowerCase();

    if (lowerCaseQuery.includes('report') || lowerCaseQuery.includes('summary')) {
      // 1. Fetch user's transactions from MongoDB
      const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });

      if (!transactions || transactions.length === 0) {
        responseMessage = "You don't have any transactions recorded yet. Please add some to get a report!";
      } else {
        // 2. Process data to generate report
        let totalSpending = 0;
        let totalIncome = 0;
        const categoriesSpending = {};
        const categoriesIncome = {};

        transactions.forEach(transaction => {
          if (transaction.type === 'expense') {
            totalSpending += transaction.amount;
            categoriesSpending[transaction.category.name] = (categoriesSpending[transaction.category.name] || 0) + transaction.amount;
          } else if (transaction.type === 'income') {
            totalIncome += transaction.amount;
            categoriesIncome[transaction.category.name] = (categoriesIncome[transaction.category.name] || 0) + transaction.amount;
          }
        });

        // Generate insights (simple example)
        let insights = "Looks like you're managing your finances well!";
        const expenseCategories = Object.keys(categoriesSpending);
        if (expenseCategories.length > 0) {
            const highestExpenseCategory = expenseCategories.reduce((a, b) => categoriesSpending[a] > categoriesSpending[b] ? a : b);
            insights = `Your highest spending is in **${highestExpenseCategory}** (${categoriesSpending[highestExpenseCategory].toFixed(2)}).`;
            if (categoriesSpending[highestExpenseCategory] > (totalSpending * 0.3)) { // If it's more than 30% of total
                insights += ` Consider reviewing your budget for ${highestExpenseCategory}.`;
            }
        }

        reportData = {
          date: new Date().toLocaleDateString(),
          totalSpending: totalSpending,
          totalIncome: totalIncome,
          categories: categoriesSpending, // Can also include categoriesIncome
          insights: insights,
          recommendations: "Regularly check your spending against your budget goals."
        };

        responseMessage = "Here's your latest financial report and insights:";
      }
    } else if (lowerCaseQuery.includes('email report') || lowerCaseQuery.includes('send report')) {
        // This part needs to be more robust: First generate report, then send email.
        // For simplicity, let's assume it attempts to send the last generated report or a default one.

        // You'd typically re-run the report generation logic here to get the data
        const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
        if (transactions.length > 0) {
             // Generate report data similar to above
            let totalSpending = 0;
            const categoriesSpending = {};
            transactions.forEach(t => {
                if (t.type === 'expense') {
                    totalSpending += t.amount;
                    categoriesSpending[t.category.name] = (categoriesSpending[t.category.name] || 0) + t.amount;
                }
            });
            const insights = `Total spending: $${totalSpending.toFixed(2)}. Highest category: ${Object.keys(categoriesSpending)[0] || 'N/A'}.`;

            const user = await User.findById(userId); // Fetch user to get their email
            if (user && user.email) {
                // Construct a more detailed email body using the report data
                const emailSubject = `Your Financial Report for ${new Date().toLocaleDateString()}`;
                const emailBody = `Dear ${user.fullname || 'User'},\n\n` +
                                  `Here is your financial summary:\n` +
                                  `Total Spending: $${totalSpending.toFixed(2)}\n` +
                                  `Spending by Category:\n` +
                                  Object.entries(categoriesSpending).map(([cat, amount]) => `- ${cat}: $${amount.toFixed(2)}`).join('\n') +
                                  `\nInsights: ${insights}\n\n` +
                                  `Best regards,\nYour Financial Bot`;

                await sendEmail(user.email, emailSubject, emailBody);
                responseMessage = "I've sent your financial report to your registered email address.";
                emailSent = true;
            } else {
                responseMessage = "I couldn't find your email address to send the report. Please ensure your profile has an email.";
            }
        } else {
            responseMessage = "I don't have enough data to generate a report for email. Please add some transactions first.";
        }
    }


    res.json({
      message: responseMessage,
      report: reportData,
      emailSent: emailSent
    });

  } catch (error) {
    console.error("Chatbot API Error:", error);
    res.status(500).json({
      message: "An error occurred while processing your request. Please try again later.",
      error: error.message
    });
  }
});

module.exports = chatbotRouter;