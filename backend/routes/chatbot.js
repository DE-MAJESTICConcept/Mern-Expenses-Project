const express = require('express');
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuth"); // Ensure this is imported
const { ObjectId } = require('mongodb'); // IMPORT ObjectId from mongodb

// Helper function to add transactions (assuming it uses the direct collection)
async function addTransactionToDB(transactionsCollection, date, amount, category, description, payment_method, type, userId) {
    console.log("DEBUG: Adding transaction to DB for user:", userId);
    const newTransaction = {
        user: new ObjectId(userId), // Convert userId string to ObjectId for storage
        type: type,
        category: category,
        amount: amount,
        description: description,
        date: date, // Should be a Date object
        payment_method: payment_method,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    try {
        const result = await transactionsCollection.insertOne(newTransaction);
        console.log("DEBUG: Transaction added:", result.insertedId);
        return `Successfully added ${type}: ₦${amount.toFixed(2)} for ${category}.`;
    } catch (e) {
        console.error("Error adding transaction to DB:", e);
        throw new Error("Database error when adding transaction.");
    }
}

// Helper function to parse date ranges from query
function get_date_range_from_query(query_text) {
    const today = new Date();
    let start_date = null;
    let end_date = null;
    let period_description = "today";

    query_text = query_text.toLowerCase();

    if (query_text.includes("today")) {
        start_date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        end_date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        period_description = "today";
    } else if (query_text.includes("yesterday")) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        start_date = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
        end_date = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
        period_description = "yesterday";
    } else if (query_text.includes("this week")) {
        const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        start_date = new Date(today.setDate(diff));
        start_date.setHours(0, 0, 0, 0);
        end_date = new Date(start_date);
        end_date.setDate(start_date.getDate() + 6);
        end_date.setHours(23, 59, 59, 999);
        period_description = "this week";
    } else if (query_text.includes("last week")) {
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - (today.getDay() === 0 ? 0 : 6));
        lastWeekEnd.setHours(23, 59, 59, 999);
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
        lastWeekStart.setHours(0, 0, 0, 0);
        period_description = "last week";
    } else if (query_text.includes("this month")) {
        start_date = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        end_date = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        period_description = "this month";
    } else if (query_text.includes("last month")) {
        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        end_date = new Date(firstDayOfCurrentMonth.getTime() - 1);
        start_date = new Date(end_date.getFullYear(), end_date.getMonth(), 1, 0, 0, 0, 0);
        period_description = "last month";
    } else if (query_text.includes("this year")) {
        start_date = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
        end_date = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
        period_description = "this year";
    } else if (query_text.includes("last year")) {
        start_date = new Date(today.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
        end_date = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        period_description = "last year";
    }

    if (start_date && end_date) {
        return { start_date, end_date, period_description };
    }
    return { start_date: null, end_date: null, period_description: null };
}

// --- Direct Database Query Functions ---
// These functions now explicitly take 'transactionsCollection' and 'userId' as arguments
async function getTransactionsFromDB(transactionsCollection, startDate, endDate, category = null, type = null, userId) {
    if (!transactionsCollection) {
        console.error("ERROR: MongoDB transactionsCollection is not initialized in getTransactionsFromDB.");
        return [];
    }
    if (!userId) {
        console.error("ERROR: userId is missing in getTransactionsFromDB. Cannot query transactions.");
        return [];
    }

    console.log("DEBUG: Building MongoDB query for getTransactionsFromDB for userId:", userId);
    console.log("  startDate (raw):", startDate);
    console.log("  typeof startDate:", typeof startDate, startDate instanceof Date);
    console.log("  endDate (raw):", endDate);
    console.log("  typeof endDate:", typeof endDate, endDate instanceof Date);
    console.log("  category (raw):", category);
    console.log("  type (raw):", type);

    // Convert userId string to ObjectId for querying
    const userObjectId = new ObjectId(userId);
    console.log("DEBUG: userObjectId for query:", userObjectId); // Log the actual ObjectId being used

    const query = { user: userObjectId }; // Filter by user ID as ObjectId

    // Convert startDate and endDate to Date objects if they are not null
    if (startDate instanceof Date) {
        query.date = { $gte: startDate };
        console.log("DEBUG: Query date $gte (Date object):", startDate.toISOString());
    } else if (startDate) {
        const parsedStartDate = new Date(startDate);
        query.date = { $gte: parsedStartDate };
        console.log("DEBUG: Query date $gte (parsed from string):", parsedStartDate.toISOString());
    }

    if (endDate instanceof Date) {
        query.date = { ...(query.date || {}), $lte: endDate };
        console.log("DEBUG: Query date $lte (Date object):", endDate.toISOString());
    } else if (endDate) {
        const parsedEndDate = new Date(endDate);
        query.date = { ...(query.date || {}), $lte: parsedEndDate };
        console.log("DEBUG: Query date $lte (parsed from string):", parsedEndDate.toISOString());
    }

    // Ensure type is not null/undefined/empty string before creating regex
    if (type && typeof type === 'string' && type.trim() !== '') {
        query.type = { $regex: new RegExp(type.trim(), 'i') };
        console.log(`DEBUG: Type regex created: ${new RegExp(type.trim(), 'i')}`);
    } else {
        console.log("DEBUG: Type is null, undefined, or empty. Not adding type filter.");
    }

    // Ensure category is not null/undefined/empty string before creating regex
    if (category && typeof category === 'string' && category.trim() !== '') {
        query.category = { $regex: new RegExp(category.trim(), 'i') };
        console.log(`DEBUG: Category regex created: ${new RegExp(category.trim(), 'i')}`);
    } else {
        console.log("DEBUG: Category is null, undefined, or empty. Not adding category filter.");
    }

    console.log("DEBUG: Final MongoDB query object (before stringify):", query);
    console.log("DEBUG: Final MongoDB query object (JSON.stringify):", JSON.stringify(query, null, 2));

    try {
        // --- TEMPORARY DEBUGGING: Test a simple query for the user ---
        // This query should return ALL transactions for the user, regardless of date/type/category
        const testUserQuery = { user: userObjectId };
        const testTransactions = await transactionsCollection.find(testUserQuery).toArray();
        console.log(`DEBUG: Test query (user only) found: ${testTransactions.length} transactions.`);
        if (testTransactions.length > 0) {
            console.log("DEBUG: First test transaction:", testTransactions[0]);
        }

        // --- TEMPORARY DEBUGGING: Test a specific known income transaction ---
        // Replace with an actual _id and user ID from your database that you know exists
        const knownIncomeId = "6840221c80902560deaaee9e"; // From your provided income document
        const knownUserId = "683ad2cb961a56a6a375ee33"; // From your provided income document
        const testSpecificQuery = {
            _id: new ObjectId(knownIncomeId),
            user: new ObjectId(knownUserId)
        };
        const testSpecificTransaction = await transactionsCollection.findOne(testSpecificQuery);
        console.log(`DEBUG: Test specific query (known income ID) found:`, testSpecificTransaction ? "1" : "0", "transaction.");
        if (testSpecificTransaction) {
            console.log("DEBUG: Known income transaction found:", testSpecificTransaction);
        } else {
            console.log("DEBUG: Known income transaction NOT found. Check ID and user ID in DB.");
        }
        // --- END TEMPORARY DEBUGGING ---


        const transactions = await transactionsCollection.find(query).sort({ date: 1 }).toArray();
        console.log("DEBUG: Transactions found from DB (with full query):", transactions.length);
        if (transactions.length > 0) {
            console.log("DEBUG: First transaction found (with full query):", transactions[0]);
        }
        return transactions;
    } catch (e) {
        console.error("Error fetching transactions from DB:", e);
        return [];
    }
}


// --- Chatbot Response Generation Logic ---
async function generateChatbotResponse(query, transactionsCollection, userId) {
    console.log("DEBUG: generateChatbotResponse received query:", query, "for userId:", userId);
    const lowerCaseQuery = query.toLowerCase();

    // 1. Handle "Add Transaction"
    if (lowerCaseQuery.startsWith("add expense:") || lowerCaseQuery.startsWith("add income:")) {
        console.log("DEBUG: Query matched 'add expense/income' pattern.");
        const transaction_type = lowerCaseQuery.startsWith("add expense:") ? "expense" : "income";
        const parts_str = lowerCaseQuery.split(`add ${transaction_type}:`)[1].trim();
        const parts = parts_str.split(",").map(p => p.trim());

        if (parts.length >= 1) {
            try {
                let amount = 0.0;
                let description = "No description";
                let category = "Uncategorized";
                let payment_method = "Unknown";
                let transaction_date = new Date();

                const amountDescMatch = parts[0].match(/(\d+(\.\d+)?)\s*(?:for\s*)?(.*)/i);
                if (amountDescMatch) {
                    amount = parseFloat(amountDescMatch[1]);
                    if (amountDescMatch[3]) {
                        description = amountDescMatch[3].split(/category|on|via/i)[0].trim();
                    }
                } else {
                    throw new Error("Could not parse amount and description.");
                }

                for (const part of parts.slice(1)) {
                    const part_lower = part.toLowerCase();
                    if (part_lower.includes("category")) {
                        category = part_lower.split("category")[1].trim();
                    } else if (part_lower.includes("on ")) {
                        if (part_lower.includes("today")) {
                            transaction_date = new Date();
                        } else if (part_lower.includes("yesterday")) {
                            const d = new Date();
                            d.setDate(d.getDate() - 1);
                            transaction_date = d;
                        } else {
                            try {
                                const date_str_part = part_lower.split("on ")[1].trim();
                                transaction_date = new Date(date_str_part);
                                if (isNaN(transaction_date.getTime())) {
                                    throw new Error("Invalid date format.");
                                }
                            } catch (e) {
                                // Keep default if date format is wrong
                            }
                        }
                    } else if (part_lower.includes("card") || part_lower.includes("cash") || part_lower.includes("bank")) {
                        payment_method = part;
                    }
                }

                if (!category) {
                    category = "Uncategorized";
                }

                return await addTransactionToDB(
                    transactionsCollection,
                    transaction_date,
                    amount,
                    category,
                    description,
                    payment_method,
                    transaction_type,
                    userId
                );

            } catch (error) {
                return `I need a valid format for the ${transaction_type}: ${error.message}`;
            }
        } else {
            return `Please provide the ${transaction_type} in the format: 'Add ${transaction_type}: <amount> for <description>, category <category_name>, on <date (YYYY-MM-DD) or today/yesterday>, <payment_method>' `;
        }
    }

    // --- Handle "Show Balance" and "Show Report" (no date range needed) ---
    if (lowerCaseQuery.includes("show balance")) {
        console.log("DEBUG: Matched 'show balance' command.");
        try {
            const allTransactions = await getTransactionsFromDB(transactionsCollection, null, null, null, null, userId);
            let totalIncome = 0;
            let totalExpenses = 0;

            allTransactions.forEach(tx => {
                if (tx.type.toLowerCase() === 'income') {
                    totalIncome += tx.amount;
                } else if (tx.type.toLowerCase() === 'expense') {
                    totalExpenses += tx.amount;
                }
            });

            const currentBalance = totalIncome - totalExpenses;
            return `Your current balance is: ₦${currentBalance.toFixed(2)}. (Total Income: ₦${totalIncome.toFixed(2)}, Total Expenses: ₦${totalExpenses.toFixed(2)})`;
        } catch (error) {
            console.error("Error fetching balance:", error);
            return "Failed to fetch your balance. Please try again later.";
        }
    }

    if (lowerCaseQuery.includes("show report")) {
        console.log("DEBUG: Matched 'show report' command.");
        try {
            const allTransactions = await getTransactionsFromDB(transactionsCollection, null, null, null, null, userId);
            let totalIncome = 0;
            let totalExpenses = 0;

            allTransactions.forEach(tx => {
                if (tx.type.toLowerCase() === 'income') {
                    totalIncome += tx.amount;
                } else if (tx.type.toLowerCase() === 'expense') {
                    totalExpenses += tx.amount;
                }
            });

            const netBalance = totalIncome - totalExpenses;

            let reportText = `Financial Report Summary:\n`;
            reportText += `- Total Income: ₦${totalIncome.toFixed(2)}\n`;
            reportText += `- Total Expenses: ₦${totalExpenses.toFixed(2)}\n`;
            reportText += `- Net Balance: ₦${netBalance.toFixed(2)}\n`;
            return reportText;
        } catch (error) {
            console.error("Error generating report:", error);
            return "Failed to generate financial report. Please try again later.";
        }
    }

    // 2. Handle "Show Transactions" or "Total Spending/Income" (requires date range)
    console.log("DEBUG: Query did NOT match 'add expense/income' or 'show balance/report'. Attempting to parse financial query with date range.");

    const { start_date, end_date, period_description } = get_date_range_from_query(lowerCaseQuery);
    console.log("DEBUG: get_date_range_from_query result:", {
        start_date: start_date ? start_date.toISOString() : null,
        end_date: end_date ? end_date.toISOString() : null,
        period_description
    });

    if (start_date && end_date) {
        console.log("DEBUG: Date range successfully identified. Proceeding to type/category parsing.");

        let requested_type = null;
        if ((lowerCaseQuery.includes("income") || lowerCaseQuery.includes("earn") || lowerCaseQuery.includes("earned")) && !lowerCaseQuery.includes("expense") && !lowerCaseQuery.includes("spend") && !lowerCaseQuery.includes("spent")) {
            requested_type = "income";
            console.log("DEBUG: Requested type: INCOME");
        } else if ((lowerCaseQuery.includes("expense") || lowerCaseQuery.includes("spend") || lowerCaseQuery.includes("spent")) && !lowerCaseQuery.includes("income") && !lowerCaseQuery.includes("earn") && !lowerCaseQuery.includes("earned")) {
            requested_type = "expense";
            console.log("DEBUG: Requested type: EXPENSE");
        } else {
            console.log("DEBUG: Requested type: NONE (will default to all transactions or be ambiguous)");
        }

        let category_match = null;
        const category_keywords = ["on", "for", "in"];
        for (const keyword of category_keywords) {
            const categoryRegex = new RegExp(`${keyword}\\s+([a-zA-Z0-9\\s]+?)(?:\\s+(?:today|yesterday|this|last|month|week|year|income|expense|how much|show me|total|what did|earn|spent)|$)`, 'i');
            const match = lowerCaseQuery.match(categoryRegex);
            if (match && match[1]) {
                category_match = match[1].trim();
                console.log(`DEBUG: Category matched using keyword '${keyword}': '${category_match}'`);
                break;
            }
        }
        if (!category_match) {
            console.log("DEBUG: No specific category identified.");
        }

        console.log("DEBUG: Checking main command conditions. Current lowerCaseQuery:", lowerCaseQuery);
        console.log("DEBUG: lowerCaseQuery.includes('how much'):", lowerCaseQuery.includes("how much"));
        console.log("DEBUG: lowerCaseQuery.includes('total'):", lowerCaseQuery.includes("total"));
        console.log("DEBUG: lowerCaseQuery.includes('show me my'):", lowerCaseQuery.includes("show me my"));
        console.log("DEBUG: lowerCaseQuery.includes('what did i'):", lowerCaseQuery.includes("what did i"));


        if (lowerCaseQuery.includes("how much") || lowerCaseQuery.includes("total")) {
            console.log("DEBUG: Matched 'how much' or 'total' command.");
            const totalTransactions = await getTransactionsFromDB(transactionsCollection, start_date, end_date, category_match, requested_type, userId);
            const sum = totalTransactions.reduce((acc, tx) => acc + tx.amount, 0);
            
            const type_phrase = requested_type || "spent/earned";
            const category_phrase = category_match ? ` on ${category_match}` : "";

            if (sum > 0) {
                return `You ${type_phrase} ₦${sum.toFixed(2)}${category_phrase} ${period_description}.`;
            } else {
                return `I couldn't find any ${type_phrase}${category_phrase} for ${period_description}.`;
            }
        } else if (lowerCaseQuery.includes("show me my") || lowerCaseQuery.includes("what did i")) {
            console.log("DEBUG: Matched 'show me my' or 'what did i' command.");
            const transactions = await getTransactionsFromDB(transactionsCollection, start_date, end_date, category_match, requested_type, userId);
            const type_phrase = requested_type || "transactions";
            const category_phrase = category_match ? ` on ${category_match}` : "";

            if (transactions.length > 0) {
                let response_text = `Here are your ${type_phrase}${category_phrase} from ${period_description}:\n`;
                for (const tx of transactions) {
                    const display_date = tx.date instanceof Date ? tx.date.toISOString().split('T')[0] : String(tx.date);
                    response_text += `- ${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}: ₦${tx.amount.toFixed(2)} on ${tx.category} (${tx.description}) on ${display_date}\n`;
                }
                return response_text;
            } else {
                return `I couldn't find any ${type_phrase}${category_phrase} for ${period_description}.`;
            }
        } else {
            console.log("DEBUG: No specific 'how much' or 'show me my' command identified after date parsing.");
        }
    } else {
        console.log("DEBUG: No specific date range identified by get_date_range_from_query.");
    }

    console.log("DEBUG: Falling back to default response.");
    return "I can tell you about your finances. Try asking 'How much did I spend today?', 'Show me my income last week', or 'Add expense: 50 for dinner, food, today, cash'.";
}


router.post('/', isAuthenticated, async (req, res) => {
    try {
        console.log("DEBUG: Request reached /chatbot route handler!");
        const { query } = req.body;
        console.log("DEBUG: Request body:", req.body);

        // Assuming isAuthenticated middleware attaches user info to req.user
        // Adjust this based on how your isAuthenticated middleware works
        const userId = req.user ? req.user.id : null; // Get user ID from req.user
        if (!userId) {
            return res.status(401).json({ response: "Authentication required to use the chatbot." });
        }

        const transactionsCollection = req.transactionsCollection; // From app.js middleware
        if (!transactionsCollection) {
            console.error("ERROR: transactionsCollection not attached to request.");
            return res.status(500).json({ response: "Chatbot service is not fully initialized." });
        }

        const botResponse = await generateChatbotResponse(query, transactionsCollection, userId);
        res.json({ response: botResponse });
    } catch (error) {
        console.error("Error in chatbot route:", error);
        res.status(500).json({ response: "An error occurred while processing your request." });
    }
});

module.exports = router;
