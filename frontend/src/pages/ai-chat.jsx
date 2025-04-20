import React, { useState, useEffect } from "react";
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import AiBody from "../components/AiBody";
import AiFooter from "../components/AiFooter";
import "./ai-chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Load conversation when component mounts or when conversationId changes
  useEffect(() => {
    const loadConversation = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error("No access token found");
        setIsLoading(false);
        return;
      }
      try {
        // Always try to load the latest conversation if no conversationId
        let url;
        if (conversationId) {
          url = `http://localhost:8080/api/chat/?conversation_id=${conversationId}`;
        } else {
          url = 'http://localhost:8080/api/chat/';
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.messages) {
          setMessages(data.messages);
          if (data.conversation_id) {
            setConversationId(data.conversation_id);
            localStorage.setItem('currentConversationId', data.conversation_id);
          }
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    // Try to get conversation ID from localStorage if not set
    if (!conversationId) {
      const savedConversationId = localStorage.getItem('currentConversationId');
      if (savedConversationId) {
        setConversationId(savedConversationId);
        // Don't call loadConversation here, will be triggered by conversationId change
        return;
      }
    }
    loadConversation();
  }, [conversationId]);
  
  // Handle sending messages
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const token = localStorage.getItem('accessToken');  
    if (!token) {
        console.error("No access token found");
        return;
    }

    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
        const response = await fetch('http://localhost:8080/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: message,
                conversation_id: conversationId
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Update conversation ID if new
            if (data.conversation_id) {
                setConversationId(data.conversation_id);
                localStorage.setItem('currentConversationId', data.conversation_id);
            }
            
            const aiResponse = data.response || "No response received";

            // Add an empty AI message first
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "", sender: "ai" }
            ]);

            // Simulate typing effect
            let index = 0;
            const interval = setInterval(() => {
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];

                    if (index < aiResponse.length) {
                        lastMessage.text += aiResponse[index]; // Add one character at a time
                        index++;
                    } else {
                        clearInterval(interval); // Stop animation when done
                    }

                    return updatedMessages;
                });
            }, 50); // Adjust typing speed here (50ms per character)

        } else {
            console.error('Error from API:', data.error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Sorry, I encountered an error. Please try again.", sender: "ai" }
            ]);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [
            ...prevMessages,
            { text: "Sorry, I couldn't connect to the AI service. Please check your connection.", sender: "ai" }
        ]);
    } finally {
        setIsLoading(false);
    }
  };

  // Function to start a new conversation
  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    localStorage.removeItem('currentConversationId');
  };

  return (
    <div className="MainContaineR">
      <Header />
      <div className="nav-body">
        <Sidebar onNewChat={startNewConversation} onToggle={(open) => setIsSidebarOpen(open)} />
        <div className={`main-content-wrapperAC ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
            <div className="main-contentAC">
                <AiBody messages={messages} isLoading={isLoading} />
            </div>
            <div className="footer-content">
                <AiFooter onSendMessage={handleSendMessage} isDisabled={isLoading} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;