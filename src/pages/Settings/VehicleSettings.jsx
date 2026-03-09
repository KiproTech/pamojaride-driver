import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import "./settings.css";

export default function VehicleSettings() {
  const [vehicle, setVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch vehicle data on mount
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data.vehicle) {
          setVehicle({
            type: data.data.vehicle.type || "",
            plateNumber: data.data.vehicle.plate_number || "",
            status: data.data.vehicle.status || "pending",
            logbook: null,
            insurance: null,
          });
          setForm({
            type: data.data.vehicle.type || "",
            plateNumber: data.data.vehicle.plate_number || "",
            logbook: null,
            insurance: null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch vehicle:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("plateNumber", form.plateNumber);
      if (form.logbook) formData.append("logbook", form.logbook);
      if (form.insurance) formData.append("insurance", form.insurance);

      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/users/vehicle-verification",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Vehicle updated successfully!");
        setVehicle((prev) => ({
          ...prev,
          ...form,
          status: "pending", // resets to pending after submission
        }));
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to update vehicle.");
      }
    } catch (err) {
      console.error("Error updating vehicle:", err);
      alert("Failed to update vehicle.");
    }
  };

  if (loading) return <p>Loading vehicle info...</p>;
  if (!vehicle) return <p>No vehicle found.</p>;

  return (
    <div className="settings-page">
      <h2>Vehicle Details</h2>

      <div className="info-card">
        <p><strong>Vehicle Type:</strong> {vehicle.type}</p>
        <p><strong>Plate Number:</strong> {vehicle.plateNumber}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              vehicle.status === "verified"
                ? "status-verified"
                : vehicle.status === "pending"
                ? "status-pending"
                : "status-rejected"
            }
          >
            {vehicle.status}
          </span>
        </p>
        <p><strong>Logbook:</strong> {vehicle.logbook ? "Uploaded" : "Not uploaded"}</p>
        <p><strong>Insurance:</strong> {vehicle.insurance ? "Uploaded" : "Not uploaded"}</p>
      </div>

      {vehicle.status !== "verified" && (
        <button className="primary" onClick={() => setIsEditing(true)}>
          Edit Vehicle
        </button>
      )}

      {isEditing && form && (
        <div className="edit-card">
          <h3>Edit Vehicle Details</h3>

          <label>
            Vehicle Type
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
            />
          </label>

          <label>
            Plate Number
            <input
              type="text"
              name="plateNumber"
              value={form.plateNumber}
              onChange={handleChange}
            />
          </label>

          <FileUpload
            label="Upload Logbook"
            onFileSelect={(file) =>
              setForm((prev) => ({ ...prev, logbook: file }))
            }
          />

          <FileUpload
            label="Upload Insurance"
            onFileSelect={(file) =>
              setForm((prev) => ({ ...prev, insurance: file }))
            }
          />

          <div className="action-buttons">
            <button className="primary" onClick={handleSave}>
              Save
            </button>
            <button className="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}