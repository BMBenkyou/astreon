import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/NHeader";
import Psidebar from "../components/Psidebar";
import NInputgroup from "../components/NewInputGroup";
import DeleteButton from "../components/DelButton";
import SaveButton from "../components/SaveButton";
import "./profile.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch user profile data when component mounts
    fetchProfile();
  }, []);

  const token = localStorage.getItem('accessToken'); 
  const fetchProfile = async () => {
  try {
    setLoading(true);
    const response = await axios.get("http://localhost:8080/user/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { user, bio, profile_pic } = response.data;
    setUsername(user.username);
    setBio(bio);
    if (profile_pic) {
      // Make sure the path includes 'media/'
      // If profile_pic already contains 'media/', use it as is
      // Otherwise, prepend 'media/' to the path
      const fullImagePath = profile_pic.startsWith('/profile_pics/') 
        ? `http://localhost:8080/${profile_pic}`
        : `http://localhost:8080/media/${profile_pic}`;
      
      setProfilePicPreview(fullImagePath);
      console.log("Image URL set to:", fullImagePath);
    }
    setLoading(false);
  } catch (err) {
    setError("Failed to load profile data");
    setLoading(false);
  }
};
   const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if attempting to change
    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem('accessToken');  
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      
      if (profilePic) {
        formData.append("profile_pic", profilePic);
      }
      
      if (oldPassword && newPassword) {
        formData.append("old_password", oldPassword);
        formData.append("new_password", newPassword);
      }
      
      const response = await axios.put("http://localhost:8080/user/profile/update/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSuccess("Profile updated successfully!");
      // Clear password fields after successful update
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await axios.delete("http://localhost:8080/user/profile/delete/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Redirect to login or home page after deletion
        localStorage.removeItem("token");
        window.location.href = "/login";
      } catch (err) {
        setError("Failed to delete account");
        setLoading(false);
      }
    }
  };

  return (
    <div className="schedule-container">
      <Header />
      <div className="nav-body">
        <Psidebar />
        <div className="Ninput-group-wrapper">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="profile-pic-container">
              <div className="profile-pic-preview">
                {profilePicPreview ? (
                  <img 
                    src={profilePicPreview} 
                    alt="Profile Preview" 
                    className="profile-image" 
                  />
                ) : (
                  <div className="profile-placeholder">Upload Image</div>
                )}
              </div>
              <input
                type="file"
                id="profile-pic"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="file-input"
              />
              <label htmlFor="profile-pic" className="file-input-label">
                Choose Profile Picture
              </label>
            </div>
            
            <NInputgroup 
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <div className="textarea-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <h3>Change Password</h3>
            <NInputgroup
              label="Current Password"
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <NInputgroup
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <NInputgroup
              label="Password Confirmation"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="password-toggle">
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="show-password">Show Password</label>
            </div>
            
            <div className="button-group">
              <SaveButton 
                className="save-button" 
                disabled={loading}
                onClick={handleSubmit}
              />
              <div className="danger-zone">
                <p>Danger Zone</p>
                <DeleteButton 
                  className="delete-button" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;