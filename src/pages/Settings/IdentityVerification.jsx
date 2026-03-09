import { useState } from "react";
import FileUpload from "./FileUpload";
import "./settings.css";

export default function IdentityVerification() {
  const [idDocument, setIdDocument] = useState(null);
  const [selfieWithId, setSelfieWithId] = useState(null);
  const [driverLicense, setDriverLicense] = useState(null);

  const [status, setStatus] = useState("pending"); // pending, verified, rejected
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idDocument || !selfieWithId || !driverLicense) {
      alert("Please upload all required files.");
      return;
    }

    console.log("Submitting files:", { idDocument, selfieWithId, driverLicense });
    setStatus("pending");
    setSuccessMessage("Files submitted successfully for verification!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const statusClass = {
    verified: "status-verified",
    pending: "status-pending",
    rejected: "status-rejected",
  };

  return (
    <div className="settings-page">
      <h2>Identity Verification</h2>

      <p>
        Status: <span className={statusClass[status]}>{status}</span>
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        <FileUpload
          label="Upload ID Document"
          accept="image/*,.pdf"
          onFileSelect={setIdDocument}
        />

        <FileUpload
          label="Upload Selfie with ID"
          accept="image/*"
          onFileSelect={setSelfieWithId}
        />

        <FileUpload
          label="Upload Driver License"
          accept="image/*,.pdf"
          onFileSelect={setDriverLicense}
        />

        <button type="submit" className="btn-save">
          Submit for Verification
        </button>

        {successMessage && <p className="success-text">{successMessage}</p>}
      </form>
    </div>
  );
}