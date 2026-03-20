import React, { useEffect, useState } from "react";
import { apiRequest, cancelpassengerBooking } from "../../../services/api";
import { toast } from "react-toastify";
import "./dashboard.css";

// Normalize trip data
const normalizeTrip = (t) => ({
  ...t,
  seats_available: t.seats_available ?? 0,
  driver_name: t.driver_name || "N/A",
  driver_phone: t.driver_phone || "N/A",
  vehicle_plate:
    t.vehicle_plate && t.vehicle_plate !== "N/A"
      ? t.vehicle_plate
      : "N/A",
  booking_status: t.booking_status || "active",
});

const TripCard = ({ trip, onCancel, cancellingId }) => {
  const formatDate = (datetime) => {
    if (!datetime) return "TBA";
    const d = new Date(datetime);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div
      className={`trip-card ${
        trip.booking_status === "cancelled" ? "cancelled-trip" : ""
      }`}
    >
      <div className="trip-header">
        <span>{trip.start_location} → {trip.end_location}</span>
        <span className={`trip-status ${trip.booking_status?.toLowerCase() || "unknown"}`}>
          {trip.booking_status || "Unknown"}
        </span>
      </div>

      <div className="trip-details">
        <p><strong>Date:</strong> {formatDate(trip.departure_datetime)}</p>
        <p><strong>Driver:</strong> {trip.driver_name} ({trip.driver_phone})</p>
        <p><strong>Vehicle:</strong> {trip.vehicle_plate}</p>
        <p>
          <strong>Seats Left:</strong>{" "}
          {trip.seats_available === 0 ? (
            <span className="fully-booked">0 — Fully booked</span>
          ) : (
            trip.seats_available
          )}
        </p>
        <p><strong>Price:</strong> Ksh {trip.price_per_seat ?? 0}</p>
      </div>

      {trip.booking_status === "active" && (
        <button
          onClick={() => onCancel(trip.booking_id)}
          className="cancel-trip-btn"
          disabled={cancellingId === trip.booking_id}
        >
          {cancellingId === trip.booking_id ? "Cancelling..." : "Cancel Trip"}
        </button>
      )}
    </div>
  );
};

const UpcomingTripsList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch trips
  const loadTrips = async () => {
    try {
      const data = await apiRequest("/trips/upcoming");
      if (!data?.success) return;

      setTrips(data.data.map(normalizeTrip));
    } catch (err) {
      console.error("Failed to load trips:", err.message);
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // Cancel trip
  const cancelTrip = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    try {
      setCancellingId(bookingId);

      const res = await cancelpassengerBooking(bookingId);

      if (res.success) {
        toast.success("Trip cancelled successfully");

        // 🔥 Always reload from backend (best practice)
        await loadTrips();
      } else {
        toast.error(res.message || "Failed to cancel trip");
      }
    } catch (err) {
      console.error("Cancel trip error:", err.message);
      toast.error("Failed to cancel trip");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <p>Loading upcoming trips...</p>;
  if (!trips.length) return <p>No trips found</p>;

  const activeTrips = trips.filter((t) => t.booking_status === "active");
  const cancelledTrips = trips.filter((t) => t.booking_status === "cancelled");

  return (
    <div className="upcoming-trips">
      <h3>Upcoming Trips</h3>

      {/* Active */}
      {activeTrips.length > 0 ? (
        activeTrips.map((trip) => (
          <TripCard
            key={trip.booking_id}
            trip={trip}
            onCancel={cancelTrip}
            cancellingId={cancellingId}
          />
        ))
      ) : (
        <p>No active trips</p>
      )}

      {/* Cancelled */}
      {cancelledTrips.length > 0 && (
        <>
          <h4>Cancelled Trips</h4>
          {cancelledTrips.map((trip) => (
            <TripCard key={trip.booking_id} trip={trip} />
          ))}
        </>
      )}
    </div>
  );
};

export default UpcomingTripsList;