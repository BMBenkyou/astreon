import React, { useState } from "react";
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

  const isScheduleCreated = false;

  return (
    <div className="schedule-container">
      <Header />
      <div className="nav-body">
        <Psidebar />
        <div className="Ninput-group-wrapper">
          <NInputgroup 
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <div className="button-group">
            <div className="danger-zone">
              <p>Danger Zone</p>
              {!isScheduleCreated && <DeleteButton className="delete-button" />}
            </div>
            {!isScheduleCreated && <SaveButton className="save-button" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
