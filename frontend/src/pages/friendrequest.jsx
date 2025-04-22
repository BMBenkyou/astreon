import React, { useEffect, useState } from "react";

const FriendRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  const fetchRequests = () => {
    setLoading(true);
    fetch("http://localhost:8080/user/friend-requests/received/", {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const handleAction = (id, action) => {
    fetch(`http://localhost:8080/user/friend-requests/${id}/${action}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update request");
        fetchRequests();
      })
      .catch((err) => alert("Error: " + err.message));
  };

  return (
    <div className="friend-request-container">
      <h2>Friend Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No friend requests.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id} style={{ marginBottom: "1em" }}>
              <span>
                <b>{req.from_user.username}</b> wants to be your friend.
              </span>
              <button
                style={{ marginLeft: "1em" }}
                onClick={() => handleAction(req.id, "accept")}
              >
                Accept
              </button>
              <button
                style={{ marginLeft: "0.5em" }}
                onClick={() => handleAction(req.id, "reject")}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequest;