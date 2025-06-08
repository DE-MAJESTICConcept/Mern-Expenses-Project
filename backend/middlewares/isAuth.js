const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User"); // Ensure User model is imported

const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  // Check if Authorization header is present and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // ! DEBUGGING: Log the token received before verification
      console.log("DEBUG: Token received for verification:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object (excluding password)
      // This makes req.user available in subsequent route handlers
      req.user = decoded.id; // Store only the user ID

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error("Authentication error:", error);
      // Handle different JWT errors
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error("Token expired, please login again.");
      } else if (error.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error("Invalid token, unauthorized.");
      } else {
        res.status(401);
        throw new Error("Not authorized, token failed.");
      }
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

module.exports = isAuthenticated;






// const jwt = require("jsonwebtoken");

// const isAuthenticated = async (req, res, next) => {
//   //! Get the token from the header
//   const headerObj = req.headers;
//   const token = headerObj?.authorization?.split(" ")[1];
//   //!Verify the token
//   const verifyToken = jwt.verify(token, "masynctechKey", (err, decoded) => {
//     if (err) {
//       return false;
//     } else {
//       return decoded;
//     }
//   });
//   if (verifyToken) {
//     //!Save the user req obj
//     req.user = verifyToken.id;
//     next();
//   } else {
//     const err = new Error("Token expired, login again");
//     next(err);
//   }
// };

// module.exports = isAuthenticated;
