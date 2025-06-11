
    const asyncHandler = require("express-async-handler");
    const User = require("../model/User");
    const sendEmail = require("../utils/emailSender.js");
    const Transaction = require("../model/Transaction");
    const puppeteer = require('puppeteer');
    const chromium = require('@sparticuz/chromium'); // ! NEW: Import the chromium package

    const usersController = {
      //! Existing controller functions (register, login, profile, changeUserPassword, updateUserProfile, forgotPassword, resetPassword, sendSpendingReport)
      // ... (Keep all your existing code for these functions as they are in your current usersCtrl.js)

      //! Generate PDF Report from HTML content received from frontend
      generatePdfReport: asyncHandler(async (req, res) => {
        console.log("DEBUG: generatePdfReport controller started.");
        const { htmlContent } = req.body;
        const userId = req.user;
        const user = await User.findById(userId);

        if (!user) {
          console.error("ERROR: User not found for PDF generation.");
          res.status(404);
          throw new Error("User not found.");
        }

        if (!htmlContent) {
          console.error("ERROR: No HTML content provided for PDF generation.");
          res.status(400);
          throw new Error("No HTML content provided for PDF generation.");
        }

        let browser;
        try {
          console.log("DEBUG: Launching Puppeteer browser...");
          // ! MODIFIED: Use chromium.executablePath() and chromium.args
          browser = await puppeteer.launch({
            args: chromium.args, // Use arguments from the chromium package
            executablePath: await chromium.executablePath(), // Point to chromium binary
            headless: chromium.headless, // Use headless setting from chromium package
            // You can keep additional args if needed, but chromium.args often covers common ones for cloud
            // args: [
            //   '--no-sandbox',
            //   '--disable-setuid-sandbox',
            //   '--disable-dev-shm-usage',
            //   '--disable-gpu',
            //   '--no-zygote',
            //   '--single-process'
            // ]
          });
          const page = await browser.newPage();
          console.log("DEBUG: Puppeteer browser launched, new page created.");

          await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
          });
          console.log("DEBUG: Page content set, waiting for network idle.");

          const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
          });
          console.log("DEBUG: PDF buffer generated.");

  //! Change user password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body; // Only newPassword is needed as per current API
    // Frontend should handle confirm password
    // if (newPassword !== confirmPassword) {
    //   res.status(400);
    //   throw new Error("Passwords do not match");
    // }
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=financial-dashboard-report-${Date.now()}.pdf`);
          res.send(pdfBuffer);
          console.log("DEBUG: PDF sent successfully.");

        } catch (error) {
          console.error("ERROR in generatePdfReport (Puppeteer):", error);
          if (browser) {
            console.log("DEBUG: Closing browser due to error.");
            await browser.close();
          }
          res.status(500);
          throw new Error("Failed to generate PDF report on the server: " + error.message);
        } finally {
          if (browser) {
            console.log("DEBUG: Ensuring browser is closed in finally block.");
            await browser.close();
          }
        }
      }),
    };

    module.exports = usersController;
    


// // src/controllers/usersCtrl.js
// const asyncHandler = require("express-async-handler");
// const User = require("../model/User"); // Ensure User model is imported
// const sendEmail = require("../utils/emailSender.js"); // Import your email service
// const Transaction = require("../model/Transaction"); // Import Transaction model for data

// const usersController = {
//   //! User registration
//   register: asyncHandler(async (req, res) => {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       res.status(400);
//       throw new Error("Please enter all fields");
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       res.status(400);
//       throw new Error("User already exists");
//     }

//     const user = await User.create({
//       username,
//       email,
//       password,
//     });
//     res.status(201).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: user.generateToken(),
//     });
//   }),

<<<<<<< HEAD
    if (!user) {
      // For security, always send a success message even if email not found
      return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent to your inbox." });
      // throw new Error("User with that email does not exist."); // Avoid this for security
    }
=======
//   //! User login
//   login: asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       res.status(400);
//       throw new Error("Please enter all fields");
//     }
>>>>>>> 1301c6bf6b8faf08ed20d7831e71f1bf56e380f1

//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(400);
//       throw new Error("User does not exist");
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       res.status(400);
//       throw new Error("Invalid credentials");
//     }

<<<<<<< HEAD
    try {
      await sendEmail(user.email, 'Password Reset Token', message);
      res.status(200).json({ message: 'Token sent to email!' });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('There was an error sending the email. Try again later!');
    }
  }),

  //! Reset Password
  resetPassword: asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body; // Changed from 'password' to 'newPassword' for clarity
=======
//     res.status(200).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: user.generateToken(),
//     });
//   }),

//   //! User profile
//   profile: asyncHandler(async (req, res) => {
//     const user = await User.findById(req.user).select("-password");
//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }
//     res.status(200).json(user);
//   }),
>>>>>>> 1301c6bf6b8faf08ed20d7831e71f1bf56e380f1

//   //! Change user password
//   changeUserPassword: asyncHandler(async (req, res) => {
//     const { newPassword, confirmPassword } = req.body;
//     if (newPassword !== confirmPassword) {
//       res.status(400);
//       throw new Error("Passwords do not match");
//     }

//     const user = await User.findById(req.user);
//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }

<<<<<<< HEAD
    user.password = newPassword; // Mongoose pre-save hook will hash this
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
=======
//     user.password = newPassword; // Mongoose pre-save hook will hash this
//     await user.save();
//     res.status(200).json({ message: "Password updated successfully" });
//   }),
>>>>>>> 1301c6bf6b8faf08ed20d7831e71f1bf56e380f1

//   //! Update user profile
//   updateUserProfile: asyncHandler(async (req, res) => {
//     const { username, email } = req.body;
//     const user = await User.findById(req.user);

<<<<<<< HEAD
  //! Send Spending Report to Email
  sendSpendingReport: asyncHandler(async (req, res) => {
    const userId = req.user;
    const user = await User.findById(userId);
=======
//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }
>>>>>>> 1301c6bf6b8faf08ed20d7831e71f1bf56e380f1

//     user.username = username || user.username;
//     user.email = email || user.email;

<<<<<<< HEAD
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
=======
//     await user.save();
//     res.status(200).json(user);
//   }),
>>>>>>> 1301c6bf6b8faf08ed20d7831e71f1bf56e380f1

//   //! Forgot Password
//   forgotPassword: asyncHandler(async (req, res) => {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       res.status(404);
//       throw new Error("User with that email does not exist.");
//     }

//     const resetToken = user.generatePasswordResetToken();
//     await user.save({ validateBeforeSave: false }); // Save token without validating other fields

//     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}. \n\n If you did not request this, please ignore this email and your password will remain unchanged.`;

<<<<<<< HEAD
    const subject = "Your Recent Financial Spending Report";
    const htmlContent = `
      <h1>Hello ${user.username},</h1>
      <p>Here is a summary of your financial activity for the last 30 days:</p>
      <ul>
        <li><strong>Total Income:</strong> $${totalIncome.toFixed(2)}</li>
        <li><strong>Total Expenses:</strong> $${totalExpense.toFixed(2)}</li>
        <li><strong>Net Balance:</strong> $${balance.toFixed(2)}</li>
      </ul>
      <p>Keep up the great work tracking your finances!</p>
      <p>Best regards,<br/>Your DE-MAJESTIC Financial Assistant</p>
    `;

    try {
      await sendEmail(user.email, subject, htmlContent);
      res.status(200).json({ message: "Financial report sent to your email!" });
    } catch (emailError) {
      console.error("Error sending financial report email:", emailError);
      res.status(500);
      throw new Error("Failed to send financial report email.");
    }
  }),

  //! Generate PDF Report from HTML content received from frontend
  generatePdfReport: asyncHandler(async (req, res) => {
    console.log("DEBUG: generatePdfReport controller started.");
    const { htmlContent } = req.body;
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      console.error("ERROR: User not found for PDF generation.");
      res.status(404);
      throw new Error("User not found.");
    }

    if (!htmlContent) {
      console.error("ERROR: No HTML content provided for PDF generation.");
      res.status(400);
      throw new Error("No HTML content provided for PDF generation.");
    }

    let browser;
    try {
      console.log("DEBUG: Launching Puppeteer browser...");
      // Add more args for Render stability:
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', // Recommended for Docker/Render environments
          '--disable-gpu', // Recommended for environments without dedicated GPU
          '--no-zygote', // Helps with stability
          '--single-process' // Helps with memory on some setups
        ]
      });
      const page = await browser.newPage();
      console.log("DEBUG: Puppeteer browser launched, new page created.");

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0' // Wait until network activity is idle on the page
      });
      console.log("DEBUG: Page content set, waiting for network idle.");

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true, // Crucial for background colors/images
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
      });
      console.log("DEBUG: PDF buffer generated.");

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=financial-dashboard-report-${Date.now()}.pdf`);
      res.send(pdfBuffer);
      console.log("DEBUG: PDF sent successfully.");

    } catch (error) {
      console.error("ERROR in generatePdfReport (Puppeteer):", error);
      if (browser) {
        console.log("DEBUG: Closing browser due to error.");
        await browser.close();
      }
      res.status(500);
      throw new Error("Failed to generate PDF report on the server: " + error.message); // Send more specific error
    } finally {
      if (browser) {
        console.log("DEBUG: Ensuring browser is closed in finally block.");
        await browser.close(); // Ensure browser is closed
      }
    }
  }),
};

module.exports = usersController;



// // src/controllers/usersCtrl.js
// const asyncHandler = require("express-async-handler");
// const User = require("../model/User"); // Ensure User model is imported
// const sendEmail = require("../utils/emailSender.js"); // Import your email service
// const Transaction = require("../model/Transaction"); // Import Transaction model for data

// const usersController = {
//   //! User registration
//   register: asyncHandler(async (req, res) => {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       res.status(400);
//       throw new Error("Please enter all fields");
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       res.status(400);
//       throw new Error("User already exists");
//     }

//     const user = await User.create({
//       username,
//       email,
//       password,
//     });
//     res.status(201).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: user.generateToken(),
//     });
//   }),

//   //! User login
//   login: asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       res.status(400);
//       throw new Error("Please enter all fields");
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(400);
//       throw new Error("User does not exist");
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       res.status(400);
//       throw new Error("Invalid credentials");
//     }

//     res.status(200).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: user.generateToken(),
//     });
//   }),

//   //! User profile
//   profile: asyncHandler(async (req, res) => {
//     const user = await User.findById(req.user).select("-password");
//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }
//     res.status(200).json(user);
//   }),

//   //! Change user password
//   changeUserPassword: asyncHandler(async (req, res) => {
//     const { newPassword, confirmPassword } = req.body;
//     if (newPassword !== confirmPassword) {
//       res.status(400);
//       throw new Error("Passwords do not match");
//     }

//     const user = await User.findById(req.user);
//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }

//     user.password = newPassword; // Mongoose pre-save hook will hash this
//     await user.save();
//     res.status(200).json({ message: "Password updated successfully" });
//   }),

//   //! Update user profile
//   updateUserProfile: asyncHandler(async (req, res) => {
//     const { username, email } = req.body;
//     const user = await User.findById(req.user);

//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }

//     user.username = username || user.username;
//     user.email = email || user.email;

//     await user.save();
//     res.status(200).json(user);
//   }),

//   //! Forgot Password
//   forgotPassword: asyncHandler(async (req, res) => {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       res.status(404);
//       throw new Error("User with that email does not exist.");
//     }

//     const resetToken = user.generatePasswordResetToken();
//     await user.save({ validateBeforeSave: false }); // Save token without validating other fields

//     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}. \n\n If you did not request this, please ignore this email and your password will remain unchanged.`;

//     try {
//       await sendEmail(user.email, 'Password Reset Token', message);
//       res.status(200).json({ message: 'Token sent to email!' });
//     } catch (err) {
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       await user.save({ validateBeforeSave: false });
//       res.status(500);
//       throw new Error('There was an error sending the email. Try again later!');
//     }
//   }),

//   //! Reset Password
//   resetPassword: asyncHandler(async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

=======
//     try {
//       await sendEmail(user.email, 'Password Reset Token', message);
//       res.status(200).json({ message: 'Token sent to email!' });
//     } catch (err) {
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       await user.save({ validateBeforeSave: false });
//       res.status(500);
//       throw new Error('There was an error sending the email. Try again later!');
//     }
//   }),

//   //! Reset Password
//   resetPassword: asyncHandler(async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

>>>>>>> 1301c6bf6b8faf08ed20d7831e71f1bf56e380f1
//     const user = await User.findOne({
//       passwordResetToken: token,
//       passwordResetExpires: { $gt: Date.now() } // Check if token is not expired
//     });

//     if (!user) {
//       res.status(400);
//       throw new Error('Token is invalid or has expired.');
//     }

//     user.password = password; // Mongoose pre-save hook will hash this
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;

//     await user.save();
//     res.status(200).json({ message: 'Password has been reset!' });
//   }),

//   //! NEW: Send Spending Report to Email (Ensuring it's correctly placed and defined)
//   sendSpendingReport: asyncHandler(async (req, res) => {
//     const userId = req.user; // Get user ID from authenticated request
//     const user = await User.findById(userId); // Find the user to get their email

//     if (!user) {
//       res.status(404);
//       throw new Error("User not found.");
//     }

//     // Fetch financial summary for the last 30 days (similar to getFinancialSummaryForAdvice)
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const transactions = await Transaction.find({
//       user: userId,
//       date: { $gte: thirtyDaysAgo }
//     });

//     let totalIncome = 0;
//     let totalExpense = 0;

//     transactions.forEach(transaction => {
//       if (transaction.type === 'income') {
//         totalIncome += transaction.amount;
//       } else if (transaction.type === 'expense') {
//         totalExpense += transaction.amount;
//       }
//     });

//     const balance = totalIncome - totalExpense;

//     // Prepare email content
//     const subject = "Your Recent Financial Spending Report";
//     const htmlContent = `
//       <h1>Hello ${user.username},</h1>
//       <p>Here is a summary of your financial activity for the last 30 days:</p>
//       <ul>
//         <li><strong>Total Income:</strong> $${totalIncome.toFixed(2)}</li>
//         <li><strong>Total Expenses:</strong> $${totalExpense.toFixed(2)}</li>
//         <li><strong>Net Balance:</strong> $${balance.toFixed(2)}</li>
//       </ul>
//       <p>Keep up the great work tracking your finances!</p>
//       <p>Best regards,<br/>Your DE-MAJESTIC Financial Assistant</p>
//     `;

//     try {
//       await sendEmail(user.email, subject, htmlContent);
//       res.status(200).json({ message: "Financial report sent to your email!" });
//     } catch (emailError) {
//       console.error("Error sending financial report email:", emailError);
//       res.status(500);
//       throw new Error("Failed to send financial report email.");
//     }
//   }),
// };

// module.exports = usersController;
