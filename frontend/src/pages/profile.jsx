import React, { useState, useEffect } from "react";
import Header from "../components/NHeader";
import NInputgroup from "../components/NewInputGroup";
import DeleteButton from "../components/DelButton";
import SaveButton from "../components/SaveButton";

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
      const response = await fetch("http://localhost:8080/user/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      const { user, bio, profile_pic } = data;

      setUsername(user.username);
      setBio(bio || "");

      if (profile_pic) {
        // Adjust path handling as needed based on your backend
        const fullImagePath = profile_pic.startsWith('http') // Check if it's already a full URL
          ? profile_pic
          : profile_pic.startsWith('/media/')
            ? `http://localhost:8080${profile_pic}` // Assume /media is served from backend root
            : `http://localhost:8080/media/${profile_pic}`; // Assume profile_pic is just filename in media

        setProfilePicPreview(fullImagePath);
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
    if ((oldPassword || newPassword || confirmPassword) && (newPassword !== confirmPassword)) {
      setError("New passwords don't match");
      return;
    }
    if ((oldPassword || newPassword || confirmPassword) && !oldPassword) {
      setError("Current password is required to change password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Create form data for file upload
      const formData = new FormData();
      // Only append if values are changed or non-empty
      if (username) formData.append("username", username);
      if (bio !== null && bio !== undefined) formData.append("bio", bio);

      if (profilePic) {
        formData.append("profile_pic", profilePic);
      }

      if (oldPassword && newPassword) {
        formData.append("old_password", oldPassword);
        formData.append("new_password", newPassword);
      }

      // Check if any data has been added to formData
      let isFormDataEmpty = true;
      for (const pair of formData.entries()) {
          isFormDataEmpty = false;
          break;
      }

      if (isFormDataEmpty && !profilePic && !(oldPassword && newPassword)) {
          setError("No changes detected.");
          setLoading(false);
          return;
      }

      const response = await fetch("http://localhost:8080/user/profile/update/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Do NOT set Content-Type: 'multipart/form-data' header manually for FormData.
          // The browser sets it automatically with the correct boundary.
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check if errorData.error is an object with keys and values (common for validation errors)
        if (typeof errorData.error === 'object' && errorData.error !== null) {
             const errorMessages = Object.entries(errorData.error)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('\n');
             throw new Error(errorMessages || "Failed to update profile");
        }
        throw new Error(errorData.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      // Clear password fields after successful update
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Re-fetch profile to update preview if backend processed the new image
      fetchProfile(); // Consider if this is necessary or if preview is sufficient
      setLoading(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile");
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        setLoading(true);
        setError(""); // Clear previous errors
        setSuccess(""); // Clear previous success messages
        const response = await fetch("http://localhost:8080/user/profile/delete/", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.error || "Failed to delete account");
        }

        // Redirect to login or home page after deletion
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Or use React Router's navigate

      } catch (err) {
        console.error("Account deletion error:", err);
        setError(err.message || "Failed to delete account");
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-200 min-h-screen">
      <Header />
      {/* Added a fixed top margin to prevent header overlap */}
      <div className="pt-20 md:pt-24 lg:pt-28 container mx-auto p-4">
        <div className="max-w-300 mx-auto p-6 rounded-lg shadow-md">

          {loading && <div className="text-center text-[#23BA8E] mb-4">Loading...</div>}
          {error && <div className="text-red-500 mb-4 p-3 bg-red-100 border border-red-400 rounded">{error}</div>}
          {success && <div className="text-green-500 mb-4 p-3 bg-green-100 border border-green-400 rounded">{success}</div>}

          <h2 className="text-2xl font-bold text-[#1B1819] mb-6 text-center">Profile Settings</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#23BA8E] shadow-sm">
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                    Photo
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profile-pic"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
              <label
                htmlFor="profile-pic"
                className="cursor-pointer bg-[#23BA8E] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1A9B75] transition duration-300"
              >
                Change Photo
              </label>
            </div>

            {/* Username Input */}
           <div>
  <label htmlFor="username" className="block text-sm font-medium text-[#1B1819] mb-1">Username</label>
  <NInputgroup
    id="username"
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#23BA8E] focus:border-transparent"
  />
</div> 

            {/* Bio Textarea */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-[#1B1819] mb-1">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#23BA8E] focus:border-transparent"
              />
            </div>

            {/* Change Password Section */}
            <div>
              <h3 className="text-xl font-bold text-[#1B1819] mb-4 border-b pb-2">Change Password</h3>
              <div className="flex flex-col gap-4">
                {/* Current Password Input */}
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-[#1B1819] mb-1">Current Password</label>
                  <NInputgroup
                    id="oldPassword"
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#23BA8E] focus:border-transparent"
                  />
                </div>

                {/* New Password Input */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-[#1B1819] mb-1">New Password</label>
                  <NInputgroup
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#23BA8E] focus:border-transparent"
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1B1819] mb-1">Confirm Password</label>
                  <NInputgroup
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#23BA8E] focus:border-transparent"
                  />
                </div>

                {/* Show Password Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-password"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2 h-4 w-4 text-[#23BA8E] focus:ring-[#23BA8E] border-gray-300 rounded"
                  />
                  <label htmlFor="show-password" className="text-sm text-[#1B1819]">Show Password</label>
                </div>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex justify-end gap-4 mt-4">
              <SaveButton
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#23BA8E] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1A9B75] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Danger Zone */}
            <div className="border border-red-400 rounded-lg p-4 mt-6 bg-red-50">
              <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
              <p className="text-sm text-red-500 mb-4">Deleting your account is irreversible. All your data will be permanently removed.</p>
              <DeleteButton
                onClick={handleDeleteAccount}
                disabled={loading}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;