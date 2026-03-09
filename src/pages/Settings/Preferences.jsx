import { useState } from "react";
import "./settings.css";

export default function Preferences() {
  const [preferences, setPreferences] = useState({
    language: "English",
    darkMode: false,
    notifications: true,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log("Preferences saved:", preferences);
    setSuccessMessage("Preferences saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="settings-page">
      <h2>Preferences</h2>

      <div className="settings-form">
        <div className="form-group">
          <label>Language</label>
          <select name="language" value={preferences.language} onChange={handleChange}>
            <option value="English">English</option>
            <option value="Swahili">Swahili</option>
            <option value="French">French</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="darkMode"
              checked={preferences.darkMode}
              onChange={handleChange}
            />
            Dark Mode
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="notifications"
              checked={preferences.notifications}
              onChange={handleChange}
            />
            Enable Notifications
          </label>
        </div>

        <button type="button" className="primary-btn" onClick={handleSave}>
          Save Preferences
        </button>

        {successMessage && <p className="success-text">{successMessage}</p>}
      </div>
    </div>
  );
}