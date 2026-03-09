import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import defaultProfile from "../../assets/images/default-profile.png";
import "./settings.css";

export default function ProfileSettings() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [driver, setDriver] = useState({
    fullName: storedUser?.full_name || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    address: storedUser?.address || "",
    idNumber: storedUser?.id_number || "",
    profilePic: storedUser?.profile_picture || defaultProfile,
    status: storedUser?.account_status || "unverified",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(driver);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setForm(driver);
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setDriver(form);
    setIsEditing(false);

    // Update localStorage temporarily until backend is connected
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        id_number: form.idNumber,
        profile_picture: form.profilePic,
      })
    );

    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const statusClass = {
    verified: "status-verified",
    pending: "status-pending",
    unverified: "status-rejected",
  };

  const isUnverified = driver.status !== "verified";

  return (
    <div className="settings-page">
      <h2>Profile</h2>

      {/* Profile View */}
      <div className="profile-section">
        <img src={driver.profilePic} alt="Profile" />
        <p><strong>Full Name:</strong> {driver.fullName}</p>
        <p><strong>Email:</strong> {driver.email}</p>
        <p><strong>Phone:</strong> {driver.phone || "—"}</p>
        <p><strong>Address:</strong> {driver.address || "—"}</p>
        <p><strong>ID Number:</strong> {driver.idNumber || "—"}</p>
        <p>
          <strong>Account Status:</strong>{" "}
          <span className={statusClass[driver.status]}>
            {driver.status}
          </span>
        </p>

        {!isEditing && (
          <button className="primary-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {/* Edit Profile */}
      {isEditing && (
        <div className="settings-form">
          <h3>Edit Profile</h3>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />
          </div>

          {isUnverified && (
            <>
              <div className="form-group">
                <label>ID Number</label>
                <input type="text" name="idNumber" value={form.idNumber} onChange={handleChange} />
              </div>

              <FileUpload
                label="Profile Picture"
                onFileSelect={(fileUrl) => setForm((prev) => ({ ...prev, profilePic: fileUrl }))}
              />
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>

          {successMessage && <p className="success-text">{successMessage}</p>}
        </div>
      )}

      {/* Identity Verification */}
      {isUnverified && !isEditing && (
        <div className="settings-form">
          <h3>Identity Verification</h3>
          <FileUpload label="Upload ID Document" />
          <FileUpload label="Upload Selfie with ID" />
          <button className="primary-btn" style={{ marginTop: "10px" }}>Submit Verification</button>
        </div>
      )}
    </div>
  );
}