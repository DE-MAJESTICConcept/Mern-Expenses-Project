const express = require("express");
const usersController = require("../controllers/usersCtrl"); // Ensure usersController is correctly imported
const isAuthenticated = require("../middlewares/isAuth"); // Ensure this path is correct

const userRouter = express.Router();

//! Register
userRouter.post("/api/v1/users/register", usersController.register);
//! Login
userRouter.post("/api/v1/users/login", usersController.login);

//! Profile
userRouter.get(
  "/api/v1/users/profile",
  isAuthenticated,
  usersController.profile
);
//! Change password
userRouter.put(
  "/api/v1/users/change-password",
  isAuthenticated,
  usersController.changeUserPassword
);
//! Update profile
userRouter.put(
  "/api/v1/users/update-profile",
  isAuthenticated,
  usersController.updateUserProfile
);

//! Forgot Password
userRouter.post('/api/v1/users/forgot-password', usersController.forgotPassword);

//! Reset Password Route
userRouter.post('/api/v1/users/reset-password/:token', usersController.resetPassword);

//! Send Spending Report (existing route)
userRouter.post('/api/v1/users/send-spending-report', isAuthenticated, usersController.sendSpendingReport);

//! NEW: Route to generate PDF report (Ensure this is correctly linked to the controller)
userRouter.post('/api/v1/users/generate-pdf-report', isAuthenticated, usersController.generatePdfReport);


module.exports = userRouter;




// const express = require("express");
// const usersController = require("../controllers/usersCtrl");
// const isAuthenticated = require("../middlewares/isAuth");
// const userRouter = express.Router();

// //! Register
// userRouter.post("/api/v1/users/register", usersController.register);
// //! Login
// userRouter.post("/api/v1/users/login", usersController.login);

// //! Profile
// userRouter.get(
//   "/api/v1/users/profile",
//   isAuthenticated,
//   usersController.profile
// );
// //! Change password
// userRouter.put(
//   "/api/v1/users/change-password",
//   isAuthenticated,
//   usersController.changeUserPassword
// );
// //! Update profile
// userRouter.put(
//   "/api/v1/users/update-profile",
//   isAuthenticated,
//   usersController.updateUserProfile
// );

// //! Forgot Password
// userRouter.post('/api/v1/users/forgot-password', usersController.forgotPassword);

// //! Reset Password Route
// userRouter.post('/api/v1/users/reset-password/:token', usersController.resetPassword);

// // ! NEW: Route to send financial spending report via email
// userRouter.post('/api/v1/users/send-spending-report', isAuthenticated, usersController.sendSpendingReport);


// module.exports = userRouter;












