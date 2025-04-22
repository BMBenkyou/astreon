import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/NHeader";
import "./addfriend.css";

const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [friendshipStatuses, setFriendshipStatuses] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // Used to force re-fetching data

  // Get the authentication token
  const token = localStorage.getItem('accessToken');

  // Fetch current user profile
  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/user/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError("Failed to authenticate user");
        setLoading(false);
      }
    };

    fetchCurrentUserProfile();
  }, [token]); // Only dependency is the token

  // Fetch all users and their friendship statuses
  useEffect(() => {
    if (!currentUser) return;

    const fetchAllUsersAndFriendships = async () => {
      try {
        setLoading(true);
        
        // Fetch all users using our endpoint
        const response = await axios.get("http://localhost:8080/user/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Filter out the current user
        const filteredUsers = response.data.filter(user => 
          user.id !== currentUser.id
        );
        
        setUsers(filteredUsers);
        
        // Fetch friendship status for each user
        const statuses = {};
        await Promise.all(filteredUsers.map(async (user) => {
          try {
            const statusResponse = await axios.get(`http://localhost:8080/user/friendship-status/${user.id}/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            statuses[user.id] = statusResponse.data.status;
          } catch (err) {
            console.error(`Error fetching status for user ${user.id}:`, err);
            // Set a default status in case of error
            statuses[user.id] = 'none';
          }
        }));
        
        setFriendshipStatuses(statuses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchAllUsersAndFriendships();
  }, [currentUser, token, refreshKey]); // Added refreshKey as dependency to force re-fetching

  // Function to refresh friendship statuses after actions
  const refreshFriendshipStatus = async (userId) => {
    try {
      const statusResponse = await axios.get(`http://localhost:8080/user/friendship-status/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setFriendshipStatuses(prev => ({
        ...prev,
        [userId]: statusResponse.data.status
      }));
      
      console.log(`Updated status for user ${userId} to ${statusResponse.data.status}`);
    } catch (err) {
      console.error(`Error refreshing status for user ${userId}:`, err);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      console.log(`Sending friend request to user ${userId}`);
      
      // Send friend request
      await axios.post(
        "http://localhost:8080/user/friend-requests/",
        { to_user: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      console.log(`Friend request sent successfully to user ${userId}`);
      
      // Update friendship status immediately for better UX
      setFriendshipStatuses(prev => ({
        ...prev,
        [userId]: 'request_sent'
      }));
      
      // Then refresh the actual status from server
      await refreshFriendshipStatus(userId);
      
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert(`Failed to send friend request: ${err.response?.data?.error || err.message}`);
    }
  };
  
  const handleCancelRequest = async (userId) => {
    try {
      console.log(`Canceling friend request to user ${userId}`);
      
      // Cancel friend request
      await axios.delete(`http://localhost:8080/user/friend-requests/cancel/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(`Friend request canceled successfully for user ${userId}`);
      
      // Update friendship status immediately for better UX
      setFriendshipStatuses(prev => ({
        ...prev,
        [userId]: 'none'
      }));
      
      // Then refresh the actual status from server
      await refreshFriendshipStatus(userId);
      
    } catch (err) {
      console.error("Error canceling friend request:", err);
      alert(`Failed to cancel friend request: ${err.response?.data?.error || err.message}`);
    }
  };
  
  const handleRemoveFriend = async (userId) => {
    try {
      console.log(`Removing friend ${userId}`);
      
      // Remove friend
      await axios.delete(`http://localhost:8080/user/friends/remove/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(`Friend removed successfully: ${userId}`);
      
      // Update friendship status immediately for better UX
      setFriendshipStatuses(prev => ({
        ...prev,
        [userId]: 'none'
      }));
      
      // Then refresh the actual status from server
      await refreshFriendshipStatus(userId);
      
    } catch (err) {
      console.error("Error removing friend:", err);
      alert(`Failed to remove friend: ${err.response?.data?.error || err.message}`);
    }
  };
  
  const handleAcceptRequest = async (userId) => {
    try {
      console.log(`Accepting friend request from user ${userId}`);
      
      // Get the request ID first
      const requestsResponse = await axios.get("http://localhost:8080/user/friend-requests/list/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const receivedRequests = requestsResponse.data.received;
      const requestToAccept = receivedRequests.find(req => req.from_user.id === userId);
      
      if (requestToAccept) {
        console.log(`Found request ID ${requestToAccept.id} to accept`);
        
        // Accept the friend request
        await axios.put(`http://localhost:8080/user/friend-requests/accept/${requestToAccept.id}/`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log(`Friend request accepted successfully for user ${userId}`);
        
        // Update friendship status immediately for better UX
        setFriendshipStatuses(prev => ({
          ...prev,
          [userId]: 'friends'
        }));
        
        // Then refresh the actual status from server
        await refreshFriendshipStatus(userId);
      } else {
        console.error(`No request found from user ${userId}`);
        alert(`No friend request found from this user.`);
      }
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert(`Failed to accept friend request: ${err.response?.data?.error || err.message}`);
    }
  };

  // Function to force refresh all data
  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Improved function to safely get profile image URL or return default image
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

  const getFriendshipButton = (user) => {
    const status = friendshipStatuses[user.id];
    
    switch (status) {
      case 'friends':
        return (
          <button 
            className="remove-friend-btn" 
            onClick={() => handleRemoveFriend(user.id)}
          >
            Remove Friend
          </button>
        );
      case 'request_sent':
        return (
          <button 
            className="cancel-request-btn" 
            onClick={() => handleCancelRequest(user.id)}
          >
            Cancel Request
          </button>
        );
      case 'request_received':
        return (
          <div className="action-buttons">
            <button 
              className="accept-request-btn" 
              onClick={() => handleAcceptRequest(user.id)}
            >
              Accept Request
            </button>
          </div>
        );
      case 'none':
      default:
        return (
          <button 
            className="add-friend-btn" 
            onClick={() => handleAddFriend(user.id)}
          >
            Add Friend
          </button>
        );
    }
  };

  return (
    <div className="schedule-container">
      <Header />
      <div className="nav-body">
        <div className="add-friend-container">
          <h1 className="page-title">Add Friends</h1>
          
          <div className="controls">
            <button className="refresh-btn" onClick={refreshData}>
              Refresh Users
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="user-cards-grid">
              {users.length > 0 ? (
                users.map((user) => (
                  <div className="user-card" key={user.id}>
                    <div className="user-card-header">
                      {/* Pre-load default image for better UX */}
                      <div className="profile-pic-container">
                        <img 
                          src="/default-avatar.png"
                          alt={`${user.username}'s profile`} 
                          className="user-profile-pic default-pic"
                        />
                        {user.profile?.profile_pic && (
                          <img 
                            src={getProfileImageUrl(user.profile.profile_pic)} 
                            alt={`${user.username}'s profile`} 
                            className="user-profile-pic"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.previousSibling.style.display = 'block';
                            }}
                            onLoad={(e) => {
                              e.target.previousSibling.style.display = 'none';
                              e.target.style.display = 'block';
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="user-card-body">
                      <h3 className="user-name">{user.username}</h3>
                      <p className="user-bio">{user.profile?.bio || "No bio available."}</p>
                      <div className="friendship-status">
                        Status: {friendshipStatuses[user.id] || 'unknown'}
                      </div>
                    </div>
                    <div className="user-card-footer">
                      {getFriendshipButton(user)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-users-message">
                  No users found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriend;