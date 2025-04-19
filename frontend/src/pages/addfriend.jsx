import React, { useState, useEffect } from "react";
import Header from "../components/NHeader";
import "./addfriend.css";

const AddFriend = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    fetch("http://localhost:8080/users/get-users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data); // Make sure your backend returns an array of users
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleAddFriend = (username) => {
    alert(`Added ${username} as a friend!`);
  };

  const handleDeleteFriend = (username) => {
    alert(`Deleted ${username} from friends!`);
  };

  return (
    <>
      <div className="add-friend-container">
        <Header />
        <h1 className="add-friends-title">Add Friends</h1>

        <div className="card-row">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.username} className="card">
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={user.username}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{user.username}</h5>
                  <p className="card-text">{user.bio || "No bio available."}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn add-friend-btn"
                      onClick={() => handleAddFriend(user.username)}
                    >
                      Add Friend
                    </button>
                    <button
                      className="btn delete-friend-btn"
                      onClick={() => handleDeleteFriend(user.username)}
                    >
                      Delete Friend
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AddFriend;
