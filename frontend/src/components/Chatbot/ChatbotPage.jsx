import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

// Adjusted paths based on ChatbotPage.jsx being in src/components/Chatbot/
import chatbotConfig from './config.jsx';
import MessageParser from './MessageParser.jsx';
import ActionProvider from './ActionProvider.jsx';

// Your main App.css should be imported where it applies to the root,
// but for component-specific global overrides, sometimes importing here helps.
// Correct path if App.css is in src/:
import '../../App.css'; 

// ChatbotPage now accepts an `onClose` prop (if you want an internal close button)
const ChatbotPage = ({ onClose }) => {
  return (
    // The main styling for the floating panel is applied to .chatbot-overlay-wrapper in App.jsx's render
    // This div will contain the actual react-chatbot-kit instance
    <div className="chatbot-instance-container">
      {/* Optional: You can add an internal close button here in the header
          by customizing chatbotConfig.customComponents.header
          and using the onClose prop. */}
      <Chatbot
        config={chatbotConfig} // Use the imported config
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
};

export default ChatbotPage;