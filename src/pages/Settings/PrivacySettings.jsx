import { useState } from "react";
import "./settings.css";

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    showPhoneToPassengers: true,
    showEmailToPassengers: false,
    receiveNotifications: true,
    hideTripsFromSearch: false,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    console.log("Saving privacy settings:", settings);
    setSuccessMessage("Privacy settings saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="settings-page">
      <h2>Privacy Settings</h2>

      <div className="settings-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="showPhoneToPassengers"
              checked={settings.showPhoneToPassengers}
              onChange={handleToggle}
            />
            Show phone number to passengers
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="showEmailToPassengers"
              checked={settings.showEmailToPassengers}
              onChange={handleToggle}
            />
            Show email address to passengers
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="receiveNotifications"
              checked={settings.receiveNotifications}
              onChange={handleToggle}
            />
            Receive notifications about trips & payments
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="hideTripsFromSearch"
              checked={settings.hideTripsFromSearch}
              onChange={handleToggle}
            />
            Hide my trips from passenger search (private mode)
          </label>
        </div>

        <button type="button" className="primary-btn" onClick={handleSave}>
          Save Settings
        </button>

        {successMessage && <p className="success-text">{successMessage}</p>}
      </div>
    </div>
  );
}