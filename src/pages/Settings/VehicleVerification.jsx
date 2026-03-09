import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import "./settings.css";

export default function VehicleVerification() {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch vehicle info from backend
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming you store JWT here
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
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicle.logbook || !vehicle.insurance) {
      alert("Please upload all required documents.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("logbook", vehicle.logbook);
      formData.append("insurance", vehicle.insurance);
      formData.append("type", vehicle.type);
      formData.append("plateNumber", vehicle.plateNumber);

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
        alert("Vehicle submitted for verification!");
        setVehicle((prev) => ({ ...prev, status: "pending" }));
      } else {
        alert(data.message || "Failed to submit vehicle.");
      }
    } catch (err) {
      console.error("Vehicle submission error:", err);
      alert("Failed to submit vehicle.");
    }
  };

  if (loading) return <p>Loading vehicle info...</p>;
  if (!vehicle) return <p>No vehicle found.</p>;

  return (
    <div className="settings-page">
      <h2>Vehicle Verification</h2>

      <p>
        Status:{" "}
        <span
          className={
            vehicle.status === "verified"
              ? "status-verified"
              : vehicle.status === "rejected"
              ? "status-rejected"
              : "status-pending"
          }
        >
          {vehicle.status}
        </span>
      </p>

      <form className="verification-form" onSubmit={handleSubmit}>
        <label>
          Vehicle Type
          <input
            type="text"
            name="type"
            value={vehicle.type}
            onChange={handleChange}
          />
        </label>

        <label>
          Plate Number
          <input
            type="text"
            name="plateNumber"
            value={vehicle.plateNumber}
            onChange={handleChange}
          />
        </label>

        <FileUpload
          label="Upload Logbook"
          accept="image/*,.pdf"
          onFileSelect={(file) =>
            setVehicle((prev) => ({ ...prev, logbook: file }))
          }
        />

        <FileUpload
          label="Upload Insurance Document"
          accept="image/*,.pdf"
          onFileSelect={(file) =>
            setVehicle((prev) => ({ ...prev, insurance: file }))
          }
        />

        <button type="submit" className="primary">
          Submit for Verification
        </button>
      </form>
    </div>
  );
}