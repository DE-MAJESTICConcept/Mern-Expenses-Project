// src/components/Chatbot/config.js
import { createChatBotMessage } from 'react-chatbot-kit';
import TransactionListWidget from './widgets/TransactionListWidget'; // Assuming this path is correct
import QuickReplies from './widgets/quickReplies.jsx'; // ! NEW: Import the QuickReplies widget

const config = {
  initialMessages: [
    createChatBotMessage(`Hello there! How can I assist you with your finances today?`),
    createChatBotMessage("Here are some things I can help you with:", {
      widget: "quickReplies", // ! NEW: Display quick replies after initial greeting
    }),
  ],
  botName: "DE-MAJESTIC Financial Assistant",
  lang: "en",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
  },
  widgets: [
    {
      widgetName: "transactionList",
      widgetFunc: (props) => <TransactionListWidget {...props} />,
      mapStateToProps: ["transactions"], // Make sure TransactionListWidget can receive this prop if needed
    },
    // ! NEW: Define the QuickReplies widget
    {
      widgetName: "quickReplies",
      widgetFunc: (props) => <QuickReplies {...props} />,
    },
  ],
  // Optional: Define custom components if you have them
  // customComponents: {},
  // Optional: Define custom message types
  // customMessages: {},
};

export default config;
