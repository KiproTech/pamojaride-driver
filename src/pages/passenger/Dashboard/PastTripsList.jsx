import React, { useEffect, useState } from "react";
import { fetchPastTrips } from "../../../services/api";
import "./dashboard.css";

const PastTripsList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPastTrips = async () => {
      try {
        const data = await fetchPastTrips();
        const normalized = (Array.isArray(data) ? data : []).map((t, idx) => ({
          ...t,
          status: t.trip_status || "Unknown",
          seats_available: t.seats_available ?? 0,
          vehicle_plate: t.vehicle_plate || "N/A",
          id: t.trip_id || idx,
        }));
        setTrips(normalized);
      } catch (err) {
        console.error("Failed to load past trips:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPastTrips();
  }, []);

  const formatDate = (datetime) =>
    datetime
      ? new Date(datetime).toLocaleDateString() +
        " at " +
        new Date(datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "TBA";

  if (loading) return <p>Loading past trips...</p>;
  if (!trips.length) return <p>No past trips</p>;

  return (
    <div className="past-trips-list">
      <h4>Past Trips</h4>
      {trips.map((trip) => (
        <div key={trip.id} className="trip-card">
          <div className="trip-header">
            <span>
              {trip.start_location} → {trip.end_location}
            </span>
            <span className={`trip-status ${trip.status.toLowerCase()}`}>
              {trip.status}
            </span>
          </div>
          <div className="trip-details">
            <p><strong>Date:</strong> {formatDate(trip.departure_datetime)}</p>
            <p><strong>Driver:</strong> {trip.driver_name || "N/A"} ({trip.driver_phone || "N/A"})</p>
            <p><strong>Vehicle Plate:</strong> {trip.vehicle_plate}</p>
            <p>
              <strong>Seats Left:</strong>{" "}
              {trip.seats_available === 0 ? (
                <span className="fully-booked">0 — Fully booked</span>
              ) : trip.seats_available}
            </p>
            <p><strong>Price per seat:</strong> ${trip.price_per_seat ?? 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastTripsList;