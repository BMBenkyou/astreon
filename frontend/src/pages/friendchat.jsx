import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../components/NHeader";
import "./friendchat.css";
import { useNavigate } from "react-router-dom"; // Import for navigation

const FriendChat = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); // For redirecting
  
  // Get the authentication token
  const token = localStorage.getItem('accessToken');
  
  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);
  
  // Function to check if user is authenticated
  const checkAuthentication = () => {
    const token = localStorage.getItem('accessToken');
    const currentUserStr = localStorage.getItem('currentUser');
    
    if (!token) {
      console.warn('No access token found, redirecting to login');
      navigate('/login'); // Redirect to login page
      return;
    }
    
    if (!currentUserStr) {
      console.warn('No current user found, fetching user data');
      fetchCurrentUser();
    } else {
      try {
        const userData = JSON.parse(currentUserStr);
        setCurrentUser(userData);
        console.log('Current user loaded:', userData.id, userData.username);
      } catch (error) {
        console.error('Error parsing currentUser from localStorage:', error);
        fetchCurrentUser(); // Try fetching user data if parsing fails
      }
    }
  };
  
  // Fetch current user data from API
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        // Save user data to localStorage and state
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        setCurrentUser(response.data);
        console.log('User data fetched and saved:', response.data.id, response.data.username);
      } else {
        console.error('No user data returned from API');
        navigate('/login'); // Redirect if no user data
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      navigate('/login'); // Redirect on error
    }
  };
  
  // Fetch friends list
  useEffect(() => {
    if (!token || !currentUser) return; // Don't fetch if not authenticated
    
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/user/friends/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setFriends(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Failed to load friends");
        setLoading(false);
      }
    };

    fetchFriends();
  }, [token, refreshKey, currentUser]);
  
  // Fetch messages when a friend is selected
  useEffect(() => {
    if (!selectedFriend || !token || !currentUser) return;
    
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/messages/${selectedFriend.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setMessages(response.data);
        // Scroll to bottom after messages load
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      }
    };
    
    fetchMessages();
    
    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [selectedFriend, token, currentUser]);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setError(""); // Clear any errors
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedFriend || !currentUser) return;
    
    try {
      await axios.post(
        "http://localhost:8080/user/messages/send/",
        {
          recipient_id: selectedFriend.id,
          content: newMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      // Add the message to the UI immediately for better UX
      const tempMessage = {
        id: `temp-${Date.now()}`,
        sender: {
          id: currentUser.id,
          username: currentUser.username
        },
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");
      
      // Refresh messages from server
      setTimeout(() => {
        const fetchLatestMessages = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/user/messages/${selectedFriend.id}/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            setMessages(response.data);
          } catch (err) {
            console.error("Error fetching latest messages:", err);
          }
        };
        
        fetchLatestMessages();
      }, 500);
      
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };
  
  const getProfileImageUrl = (profilePic) => {
    // If no profile pic is provided, immediately return default
    if (!profilePic) return '/default-avatar.png';
    
    // Make sure the path includes the appropriate prefix
    if (profilePic.startsWith('/profile_pics/')) {
      return `http://localhost:8080${profilePic}`;
    } else if (profilePic.startsWith('http')) {
      return profilePic; // If it's already a full URL
    } else {
      return `http://localhost:8080/media/${profilePic}`;
    }
  };
  
  // Format timestamp for messages
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // FIXED: Improved, safer isCurrentUserMessage function
  const isCurrentUserMessage = (message) => {
    if (!currentUser || !message) return false;
    
    try {
      // Check if the message sender ID matches current user ID
      if (message.sender && message.sender.id) {
        return parseInt(message.sender.id) === parseInt(currentUser.id);
      } else if (message.sender_id) {
        return parseInt(message.sender_id) === parseInt(currentUser.id);
      }
      
      return false;
    } catch (error) {
      console.error('Error determining message sender:', error);
      return false;
    }
  };
  
  // Get time for displaying in the friends list (last message time or status)
  const getLastActivityTime = (friend) => {
    // This would ideally come from your backend
    // For now we'll just return "Online" for demo purposes
    return "Online";
  };

  // If still loading user data, show loading indicator
  if (!currentUser && !error) {
    return (
      <div className="loading-container">
        <Header />
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <Header />
      <div className="chat-body">
        <div className="friends-sidebar">
          <div className="sidebar-header">
            <h2>Chats</h2>
            <button 
              className="refresh-btn" 
              onClick={() => setRefreshKey(prevKey => prevKey + 1)}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
          
          {error && error.includes("friends") && (
            <div className="error-message">{error}</div>
          )}
          
          {loading ? (
            <div className="loading">Loading friends...</div>
          ) : (
            <div className="friends-list">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div 
                    className={`friend-item ${selectedFriend?.id === friend.id ? 'active' : ''}`}
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <div className="friend-avatar">
                      <img 
                        src={getProfileImageUrl(friend.profile?.profile_pic)} 
                        alt={`${friend.username}'s avatar`}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <span className="online-indicator"></span>
                    </div>
                    <div className="friend-info">
                      <div className="friend-name">{friend.username}</div>
                      <div className="last-message">
                        {friend.last_message || "Start a conversation"}
                      </div>
                    </div>
                    <div className="friend-meta">
                      <div className="last-time">{getLastActivityTime(friend)}</div>
                      {friend.unread_count > 0 && (
                        <div className="unread-badge">{friend.unread_count}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-friends">
                  <p>No friends yet</p>
                  <a href="/add-friend" className="add-friend-link">
                    Add Friends
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="chat-main">
          {selectedFriend ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <img 
                    src={getProfileImageUrl(selectedFriend.profile?.profile_pic)} 
                    alt={`${selectedFriend.username}'s avatar`}
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div>
                    <h3>{selectedFriend.username}</h3>
                    <span className="user-status">Online</span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="action-btn">
                    <i className="fas fa-phone"></i>
                  </button>
                  <button className="action-btn">
                    <i className="fas fa-video"></i>
                  </button>
                  <button className="action-btn">
                    <i className="fas fa-info-circle"></i>
                  </button>
                </div>
              </div>
              
              <div className="chat-messages">
                {error && error.includes("messages") && (
                  <div className="error-message">{error}</div>
                )}
                
                {messages.length > 0 ? (
                  <div className="messages-list">
                    {messages.map((message) => {
                      // FIXED: Correctly determine if message is sent or received
                      const isSent = isCurrentUserMessage(message);
                      
                      return (
                        <div 
                          key={message.id}
                          className={`message ${isSent ? 'sent' : 'received'}`}
                        >
                          <div className="message-content">
                            <p>{message.content}</p>
                            <span className="message-time">
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="empty-messages">
                    <p>No messages yet. Say hello to {selectedFriend.username}!</p>
                  </div>
                )}
              </div>
              
              <div className="chat-input">
                <form onSubmit={handleSendMessage}>
                  <div className="input-actions">
                    <button type="button" className="attachment-btn">
                      <i className="fas fa-paperclip"></i>
                    </button>
                    <button type="button" className="emoji-btn">
                      <i className="far fa-smile"></i>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={`Message ${selectedFriend.username}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="send-btn"
                    disabled={!newMessage.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="empty-chat">
              <div className="empty-chat-content">
                <img src="/chat-placeholder.png" alt="Select a friend to chat" />
                <h3>Select a friend to start chatting</h3>
                <p>Choose from your friends list or add new friends</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendChat;