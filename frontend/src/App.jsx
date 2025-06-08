import React, { useState } from 'react'; // Import useState
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

// --- Your existing imports ---
import HeroSection from "./components/Home/HomePage";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import LoginForm from "./components/Users/Login";
import RegistrationForm from "./components/Users/Register";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import AddCategory from "./components/Category/AddCategory";
import CategoriesList from "./components/Category/CategoriesList";
import UpdateCategory from "./components/Category/UpdateCategory";
import TransactionForm from "./components/Transactions/TransactionForm";
import Dashboard from "./components/Users/Dashboard";
import UserProfile from "./components/Users/UserProfile";
import UpdateTransaction from "./components/Transactions/UpdateTransaction";
import AuthRoute from "./components/Auth/AuthRoute";

// --- NEW/UPDATED IMPORTS ---
import ChatbotPage from './components/Chatbot/ChatbotPage.jsx'; // Your ChatbotPage component
import 'react-chatbot-kit/build/main.css'; // Keep this for base chatbot styles
import './App.css'; // ! IMPORTANT: UNCOMMENT THIS TO APPLY ALL CUSTOM STYLES
import { FaCommentDots, FaTimes } from 'react-icons/fa'; // Icons for the toggle button


const queryClient = new QueryClient();

function App() {
  const user = useSelector((state) => state?.auth?.user);

  // ! NEW STATE: To control chatbot visibility
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Navbar - Conditionally rendered based on user login */}
        {user ? <PrivateNavbar /> : <PublicNavbar />}

        {/* This div will wrap your main app content for proper layout with fixed elements */}
        <div className="main-app-content-wrapper">
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />

 <Route
              path="/update-transaction/:id"
              element={
                <AuthRoute>
                  <UpdateTransaction /> {/* Use your actual Update Transaction component name here */}
                </AuthRoute>
              }
            />
            {/* --- Authenticated Routes --- */}
            <Route
              path="/Dashboard"
              element={
                <AuthRoute>
                  <Dashboard />
                </AuthRoute>
              }
            />
            <Route
              path="/add-category"
              element={
                <AuthRoute>
                  <AddCategory />
                </AuthRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <AuthRoute>
                  <CategoriesList />
                </AuthRoute>
              }
            />
            {/* ! REMOVED THE DEDICATED /chatBot ROUTE */}
            {/* The chatbot will now open via the floating button */}
            {/* <Route
              path="/chatBot"
              element={
                <AuthRoute>
                  <ChatbotPage />
                </AuthRoute>
              }
            /> */}
            <Route
              path="/update-category/:id"
              element={
                <AuthRoute>
                  <UpdateCategory />
                </AuthRoute>
              }
            />
            <Route
              path="/add-transaction"
              element={
                <AuthRoute>
                  <TransactionForm />
                </AuthRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthRoute>
                  <UserProfile />
                </AuthRoute>
              }
            />
            {/* Add a catch-all for unauthorized access if AuthRoute doesn't handle it universally */}
            {!user && <Route path="/*" element={<LoginForm />} />} {/* Redirect to login if not authenticated */}
          </Routes>
        </div> {/* End of main-app-content-wrapper */}


        {/* ! FLOATING CHATBOT BUTTON */}
        {user && ( // Only show button if user is authenticated
          <button
            className="chatbot-toggle-button"
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            title={isChatbotOpen ? "Close Chatbot" : "Open Chatbot"}
          >
            {isChatbotOpen ? <FaTimes /> : <FaCommentDots />}
          </button>
        )}

        {/* ! CONDITIONAL CHATBOT RENDERING as an overlay */}
        {user && isChatbotOpen && ( // Only render if user is authenticated AND chatbot is open
          <div className="chatbot-overlay-wrapper"> {/* This wrapper controls position & animation */}
            <ChatbotPage onClose={() => setIsChatbotOpen(false)} /> {/* Pass a close handler */}
          </div>
        )}

      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;