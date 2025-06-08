const express = require("express");
const usersController = require("../controllers/usersCtrl");
const isAuthenticated = require("../middlewares/isAuth");
const transactionController = require("../controllers/transactionCtrl");
const transactionRouter = express.Router();




// ! CRITICAL: ORDER MATTERS FOR EXPRESS ROUTES!
// ! Static and more specific routes should always come BEFORE dynamic or more general routes.

// 1. Specific static routes
// This route for financial summary MUST come before any dynamic ':id' route
transactionRouter.get("/api/v1/transactions/summary-for-advice", isAuthenticated, transactionController.getFinancialSummaryForAdvice);

// This route for listing transactions MUST come before any dynamic ':id' route
transactionRouter.get("/api/v1/transactions/lists", isAuthenticated, transactionController.lists);

// 2. Dynamic routes with parameters (like :id)
// These routes will catch anything after '/transactions/' that wasn't matched by a static route above
transactionRouter.get("/api/v1/transactions/:id", isAuthenticated, transactionController.getSingleTransaction);
transactionRouter.put("/api/v1/transactions/:id", isAuthenticated, transactionController.update);
transactionRouter.delete("/api/v1/transactions/:id", isAuthenticated, transactionController.delete);


// Other routes (order less critical unless they conflict with the above)
transactionRouter.post("/api/v1/transactions/create", isAuthenticated, transactionController.create);


module.exports = transactionRouter;

