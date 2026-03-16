// src/pages/passenger/Profile/Profile.jsx
import { useState, useEffect } from "react";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import {
  updatePassengerProfile,
  changePassengerPassword,
  updateProfilePicture,
  getImageUrl,
} from "../../../services/api";
import { usePassenger } from "../../../context/PassengerContext"; // <-- usePassenger
import "./Profile.css";

const PassengerProfile = () => {
  const { passenger, updatePassenger } = usePassenger(); // <-- updated hook

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarError, setAvatarError] = useState(false);

  // -----------------------------
  // Initialize profile from context
  // -----------------------------
  useEffect(() => {
    if (passenger) {
      setProfile({
        name: passenger.full_name || "",
        email: passenger.email || "",
        phone: passenger.phone || "",
        avatar: passenger.profile_picture ? getImageUrl(passenger.profile_picture) : null,
      });
      setAvatarError(false); // reset error if passenger data updates
    }
  }, [passenger]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    try {
      const res = await updatePassengerProfile({
        full_name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });

      if (res.success) {
        updatePassenger({
          full_name: profile.name,
          email: profile.email,
          phone: profile.phone,
        });
        setEditMode(false);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const savePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    try {
      await changePassengerPassword({
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword,
      });

      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPassword(false);
      alert("Password changed successfully!");
    } catch (err) {
      console.error("Password change failed:", err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await updateProfilePicture(file);

      // Convert path to full URL
      const avatarUrl = getImageUrl(data.profile_picture);

      // Update local profile state and context
      setProfile({ ...profile, avatar: avatarUrl });
      updatePassenger({ profile_picture: data.profile_picture });
      setAvatarError(false);
    } catch (err) {
      console.error("Failed to update avatar:", err);
      setAvatarError(true);
    }
  };

  return (
    <div className="passenger-profile">
      <h2>Your Profile</h2>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="avatar-section">
          {profile.avatar && !avatarError ? (
            <img
              src={profile.avatar}
              alt="Profile"
              className="avatar"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <FaUserCircle className="default-avatar" size={80} />
          )}

          <label htmlFor="avatar-upload" className="edit-avatar">
            <FaEdit />
          </label>

          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>

        <div className="info-section">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>

          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editMode && (
        <div className="edit-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
            />
          </div>

          <button onClick={saveProfile}>Save Changes</button>
        </div>
      )}

      {/* Password Change */}
      <div className="password-card">
        <button onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide Change Password" : "Change Password"}
        </button>

        {showPassword && (
          <div className="edit-form">
            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <button onClick={savePassword}>Save Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerProfile;