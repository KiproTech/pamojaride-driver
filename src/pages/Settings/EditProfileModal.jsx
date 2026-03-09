import { useState } from "react";
import FileUpload from "./FileUpload";
import "./settings.css";

export default function EditProfileModal({ driver, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: driver.fullName,
    email: driver.email,
    phone: driver.phone,
    profilePic: driver.profilePic,
  });

  const isVerified = driver.accountStatus.toLowerCase() === "verified";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, profilePic: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Profile</h3>
        <form className="settings-form" onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          {!isVerified && (
            <FileUpload
              label="Profile Picture"
              accept="image/*"
              onFileSelect={handleProfilePicChange}
            />
          )}

          {/* Preview uploaded profile pic */}
          {!isVerified && formData.profilePic && (
            <img
              src={formData.profilePic}
              alt="Profile Preview"
              className="file-preview-img"
              style={{ marginTop: "10px", maxWidth: "150px", borderRadius: "50%" }}
            />
          )}

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isVerified}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}