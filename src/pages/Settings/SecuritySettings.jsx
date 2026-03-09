import { useState } from "react";
import "./settings.css";

export default function SecuritySettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [sessions] = useState([
    { id: 1, device: "Android Phone", location: "Kisumu, Kenya", lastActive: "Active now" },
    { id: 2, device: "Chrome Browser", location: "Nairobi, Kenya", lastActive: "2 days ago" },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    alert("Password updated successfully!");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const logoutAllDevices = () => {
    alert("Logged out from all other devices");
  };

  return (
    <div className="settings-page">
      <h2>Security</h2>

      {/* Change Password */}
      <div className="settings-section">
        <h3>Change Password</h3>

        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={handlePasswordChange}
          disabled={!form.currentPassword || !form.newPassword || !form.confirmPassword}
        >
          Update Password
        </button>
      </div>

      {/* Active Sessions */}
      <div className="settings-section">
        <h3>Active Sessions</h3>

        {sessions.map((session) => (
          <div key={session.id} className="session-card">
            <p><strong>Device:</strong> {session.device}</p>
            <p><strong>Location:</strong> {session.location}</p>
            <p><strong>Last Active:</strong> {session.lastActive}</p>
          </div>
        ))}

        <button type="button" className="danger-btn" onClick={logoutAllDevices}>
          Logout from all other devices
        </button>
      </div>
    </div>
  );
}