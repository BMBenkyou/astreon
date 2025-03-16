import React, { useState } from "react";
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import AiBody from "../components/AiBody";
import AiFooter from "../components/AiFooter";
import "./ai-chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);

  // Function to handle sending messages
  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);

    // Simulate AI response (Replace this with actual AI API call)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "This is an AI response.", sender: "ai" },
      ]);
    }, 1000);
  };

  return (
    <div className="MainContaineR">
      <Header />
      <div className="nav-body">
        <Sidebar />
        <div className="main-content-wrapperAC">
            <div className="main-contentAC">
                <AiBody messages={messages} />
            </div>
            <div className="footer-content">
                <AiFooter onSendMessage={handleSendMessage} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

