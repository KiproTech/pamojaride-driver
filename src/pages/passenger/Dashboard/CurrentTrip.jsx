import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";
import "./dashboard.css";

// Helper to fetch current (ongoing) trip
const fetchCurrentTrip = async () => {
  try {
    const data = await apiRequest("/trips/current");
    return data?.data ? data.data : null;
  } catch (err) {
    console.error("Failed to load current trip:", err.message);
    return null;
  }
};

const CurrentTrip = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const currentTrip = await fetchCurrentTrip();
        setTrip(currentTrip);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, []);

  if (loading) return <p>Loading current trip...</p>;
  if (!trip) return <p>No active trip</p>;

  const openMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${trip.start_location}&destination=${trip.end_location}`;
    window.open(url, "_blank");
  };

  const formatDate = (datetime) =>
    datetime
      ? new Date(datetime).toLocaleString([], { 
          hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric' 
        })
      : "TBA";

  return (
    <div className="trip-card">
      <div className="trip-header">
        <h3>Current Trip</h3>
        <span className={`trip-status ${trip.trip_status?.toLowerCase() || "unknown"}`}>
          {trip.trip_status || "Unknown"}
        </span>
      </div>

      <div className="trip-route">
        {trip.start_location || "Unknown"} → {trip.end_location || "Unknown"}
      </div>

      <div className="trip-details">
        <p><strong>Date & Time:</strong> {formatDate(trip.departure_datetime)}</p>
        <p><strong>Amount:</strong> Ksh {trip.amount ?? "—"}</p>
        <p>
          <strong>Seats Left:</strong>{" "}
          {trip.seats_available === 0 ? "Fully booked" : trip.seats_available ?? "—"}
        </p>
        <p><strong>Vehicle Plate:</strong> {trip.vehicle_plate || "Unknown"}</p>
      </div>

      <div className="driver-section">
        <p><strong>Driver:</strong> {trip.driver_name || "Unknown"}</p>
        <p><strong>Phone:</strong> {trip.driver_phone || "Unknown"}</p>
        {trip.driver_phone && (
          <a href={`tel:${trip.driver_phone}`} className="call-driver">Call</a>
        )}
      </div>

      <button onClick={openMap} className="navigate-btn">Track Trip</button>
    </div>
  );
};

export default CurrentTrip;