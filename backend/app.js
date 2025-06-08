// app.js (or server.js)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();

// --- Mongoose Connection (if used by other parts of your app) ---
mongoose
  .connect("mongodb+srv://me:xF4DPRZFlVvlPmwD@cluster0.hdcm0.mongodb.net/test") 
  .then(() => console.log("Mongoose DB Connected"))
  .catch((e) => console.log("Mongoose connection error:", e));

// --- Direct MongoDB Connection for Chatbot (using MongoClient) ---
const uri = "mongodb+srv://me:xF4DPRZFlVvlPmwD@cluster0.hdcm0.mongodb.net/test?retryWrites=true&w=majority"; 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let transactionsCollection; // Variable to hold the MongoDB collection object

async function connectToMongoForChatbot() {
  try {
    await client.connect();
    const database = client.db('test'); 
    transactionsCollection = database.collection('financialTransactions'); 
    console.log("Successfully connected to MongoDB for Chatbot!");
  } catch (e) {
    console.error("Failed to connect to MongoDB for Chatbot:", e);
    process.exit(1); 
  }
}

connectToMongoForChatbot(); 


//! Cors config
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

//!Middlewares
app.use(express.json()); 

// --- Add a general request logger ---
app.use((req, res, next) => {
  console.log(`GLOBAL DEBUG: Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

//!Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);

// --- Define the middleware function to attach the collection ---
const attachTransactionsCollection = (req, res, next) => {
  req.transactionsCollection = transactionsCollection; // Attach the collection object
  next();
};

// --- Import your chatbot router ---
const chatbotRouter = require('./routes/chatbot'); // Store the router in a variable

// --- ADD THESE DEBUG LOGS ---
console.log("DEBUG: Type of chatbotRouter:", typeof chatbotRouter);
// For Express Routers, 'stack' property indicates it's a router instance
console.log("DEBUG: Does chatbotRouter have a .stack property?", !!chatbotRouter.stack); 
// --- END DEBUG LOGS ---

// --- Mount the chatbot router and pass the collection ---
// This is the corrected way to use app.use with a middleware and a router
app.use('/chatbot', attachTransactionsCollection, chatbotRouter); 


//! Error Handler
app.use(errorHandler);

//!Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on this port... ${PORT} `)
);

// Graceful shutdown for MongoClient
process.on('SIGINT', async () => {
  console.log('Closing MongoDB MongoClient connection...');
  if (client) {
    await client.close();
  }
  console.log('MongoDB MongoClient connection closed. Exiting.');
  process.exit(0);
});