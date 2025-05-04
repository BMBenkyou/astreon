import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, PauseCircle, PlayCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

// Keeping Header and Sidebar imports
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false); // New state to track AI typing
  const chatContainerRef = useRef(null);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
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
        return;
      }
    }
    loadConversation();
  }, [conversationId]);
  
  // Ref to store typing interval ID outside of the message sending function
  const typingRef = useRef(null);
  
  // Toggle pause state for AI typing
  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    // If pausing, clear the interval
    if (newPausedState && typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    } 
    // If resuming, restart the typing animation
    else if (!newPausedState && !typingRef.current && isAiTyping) {
      runTypingAnimation();
    }
  };
  
  // Function to handle the typing animation (defined outside the handleSendMessage)
  const runTypingAnimation = () => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
    }
    
    // Access the latest messages and continue from current position
    const aiResponse = messages[messages.length - 1]?.text || "";
    let currentIndex = aiResponse.length;
    const fullResponse = window.lastAiResponse || "";
    
    if (currentIndex >= fullResponse.length) return;
    
    typingRef.current = setInterval(() => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        if (currentIndex < fullResponse.length) {
          lastMessage.text += fullResponse[currentIndex]; // Add one character at a time
          currentIndex++;
        } else {
          // Stop animation when done
          if (typingRef.current) {
            clearInterval(typingRef.current);
            typingRef.current = null;
          }
          setIsAiTyping(false); // Turn off AI typing state when done
        }

        return updatedMessages;
      });
    }, 50); // Adjust typing speed here (50ms per character)
  };
  
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
            
            // Set AI typing state to true
            setIsAiTyping(true);

            // Store the full AI response in window object for access during pause/resume
            window.lastAiResponse = aiResponse;
            
            // Set AI typing state to true
            setIsAiTyping(true);
            
            // Start the typing animation
            runTypingAnimation();

        } else {
            console.error('Error from API:', data.error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Sorry, I encountered an error. Please try again.", sender: "ai" }
            ]);
            setIsAiTyping(false);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [
            ...prevMessages,
            { text: "Sorry, I couldn't connect to the AI service. Please check your connection.", sender: "ai" }
        ]);
        setIsAiTyping(false);
        
        // Clean up typing interval if there's an error
        if (typingRef.current) {
            clearInterval(typingRef.current);
            typingRef.current = null;
        }
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

  const onSendButtonClick = () => {
    if (prompt.trim() !== "") {
      handleSendMessage(prompt);
      setPrompt("");
    }
  };

  // Suggestion topics for empty chat
  const suggestions = [
    {
      title: "Study Methods",
      description: "Get tailored advice on different study methods",
      icon: "📚"
    },
    {
      title: "Spaced Repetition",
      description: "Learn how spaced repetition works and integrate it",
      icon: "🔄"
    },
    {
      title: "Study Materials",
      description: "Find study materials suitable for you",
      icon: "📝"
    },
    {
      title: "Create System",
      description: "Create your own system suitable for your needs",
      icon: "⚙️"
    },
  ];

  // Handle suggestion click
  const handleSuggestionClick = (title) => {
    setPrompt(title);
    handleSendMessage(title);
  };

  const formatMessage = (text) => {
    // Simple markdown-like formatting
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const withLinks = text.replace(urlRegex, url => 
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-mintcream-500 hover:underline">${url}</a>`
    );
    
    // Convert ** for bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const withBold = withLinks.replace(boldRegex, (_, p1) => `<strong>${p1}</strong>`);
    
    // Convert * for italic text
    const italicRegex = /\*(.*?)\*/g;
    const withItalic = withBold.replace(italicRegex, (_, p1) => `<em>${p1}</em>`);
    
    // Replace newlines with <br />
    const withLineBreaks = withItalic.replace(/\n/g, '<br />');
    
    return { __html: withLineBreaks };
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#e3fef9" }}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar onNewChat={startNewConversation} onToggle={(open) => setIsSidebarOpen(open)} />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full transition-all duration-300">
        <Header />
        
        {/* Chat Area */}
        <div
          className="flex flex-col flex-1 overflow-hidden mx-auto my-2 max-w-5xl w-full"
          style={{
            background: "",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.06)",
            borderRadius: "1rem",
            marginTop: "88px", // header height (60px) + margin
            minHeight: "calc(100vh - 100px)",
            position: "relative",
          }}
        >
          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-300"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="mb-6 p-3 bg-orange-50 rounded-full">
                  <Sparkles className="h-8 w-8 text-orange-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">What would you like to learn today?</h1>
                <p className="text-gray-600 mb-8 max-w-md">Get guidance powered by AI agents on how you can maximize your productivity with studying effectively.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
                  {suggestions.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => handleSuggestionClick(item.title)}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-mintcream-400 hover:shadow-md transition-all cursor-pointer flex items-start"
                    >
                      <div className="text-2xl mr-3">{item.icon}</div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-3/4 p-4 rounded-2xl ${
                        msg.sender === "user" 
                          ? "bg-green-400 text-white rounded-br-none" 
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                      style={{ maxWidth: "75%" }}
                    >
                      {msg.type === "image" ? (
                        <img src={msg.url} alt="User upload" className="rounded-lg max-w-full" />
                      ) : (
                        <div 
                          dangerouslySetInnerHTML={formatMessage(msg.text)} 
                          className="prose prose-sm max-w-none"
                        />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* AI typing indicator */}
                {isLoading && !messages[messages.length - 1]?.text && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-bl-none" style={{ maxWidth: "75%" }}>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Pause button - only show when AI is typing */}
          {isAiTyping && (
            <div className="flex justify-center my-2">
              <button 
                onClick={togglePause} 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
                  isPaused 
                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } transition-colors`}
              >
                {isPaused ? (
                  <>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 mr-2" />
                    Pause
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 max-w-4xl mx-auto w-full">
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => document.getElementById('file-input').click()}
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input 
                id="file-input"
                type="file" 
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("File attached:", file.name);
                    // File handling logic here
                  }
                }}
              />
              
              <input
                type="text"
                placeholder="Ask me anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSendButtonClick();
                  }
                }}
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-3 py-2 text-gray-700 placeholder-gray-500"
              />
              
              <button
                onClick={onSendButtonClick}
                disabled={isLoading || !prompt.trim()}
                className={`rounded-full p-2 ${
                  prompt.trim() && !isLoading
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="text-xs text-center text-gray-400 mt-2 max-w-4xl mx-auto w-full">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;