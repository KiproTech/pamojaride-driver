import { useState, useEffect } from "react";
import TripList from "./TripList";
import TripForm from "./TripForm";
import "./manageTrips.css";

const BASE_URL = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

const fetchWithToken = async (endpoint, options = {}) => {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (_) {}

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
};

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH DRIVER TRIPS
  // ===============================
  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken("/trips");
      if (response.success && Array.isArray(response.data)) {
        setTrips(response.data);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error("Fetch trips error:", err);
      alert(err.message);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // ===============================
  // CREATE TRIP
  // ===============================
  const addTrip = async (trip) => {
    setLoading(true);
    try {
      const data = await fetchWithToken("/trips", {
        method: "POST",
        body: JSON.stringify(trip),
      });

      if (data.success && data.data) {
        setTrips((prev) => [...prev, data.data]);
        setShowForm(false);
      } else {
        alert(data.message || "Failed to create trip");
      }
    } catch (err) {
      console.error("Create trip error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // START TRIP
  // ===============================
  const startTrip = async (id) => {
    try {
      const data = await fetchWithToken(`/trips/${id}/start`, {
        method: "PATCH",
      });

      if (data.success) {
        setTrips((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "ongoing" } : t))
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Start trip error:", err);
      alert(err.message);
    }
  };

  // ===============================
  // COMPLETE TRIP
  // ===============================
  const completeTrip = async (id) => {
    try {
      const data = await fetchWithToken(`/trips/${id}/complete`, {
        method: "PATCH",
      });

      if (data.success) {
        setTrips((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Complete trip error:", err);
      alert(err.message);
    }
  };

  // ===============================
  // CANCEL TRIP
  // ===============================
  const cancelTrip = async (id, cancelType = "Cancel") => {
    try {
      const data = await fetchWithToken(`/trips/${id}/cancel`, {
        method: "PATCH",
        body: JSON.stringify({ type: cancelType }), // could be "Cancel" or "Cancel & Refund"
      });

      if (data.success) {
        setTrips((prev) => prev.filter((t) => t.id !== id));
        alert(`Trip ${cancelType === "Cancel & Refund" ? "cancelled with refund" : "cancelled"} successfully`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Cancel trip error:", err);
      alert(err.message);
    }
  };

  // ===============================
  // VIEW TRIP
  // ===============================
  const viewTrip = (trip) => {
    alert(
      `Trip: ${trip.start_location} → ${trip.end_location}\n` +
        `Date: ${new Date(trip.departure_datetime).toLocaleString()}\n` +
        `Seats: ${trip.seats_available}\n` +
        `Price: KES ${trip.price_per_seat}\n` +
        `Status: ${trip.status}`
    );
  };

  const hasActiveTrip = trips.some((t) => t.status === "upcoming" || t.status === "ongoing");

  return (
    <div className="manage-trips-page">
      <div className="manage-trips-header">
        <h2>Manage Trips</h2>
        <button
          className="add-trip-btn"
          onClick={() => setShowForm(!showForm)}
          disabled={hasActiveTrip}
          title={hasActiveTrip ? "You already have an active trip" : "Add new trip"}
        >
          + Add New Trip
        </button>
      </div>

      {showForm && <TripForm onSubmit={addTrip} loading={loading} />}

      {loading && <p>Loading trips...</p>}

      <TripList
        trips={trips}
        onView={viewTrip}
        onStart={startTrip}
        onComplete={completeTrip}
        onCancel={cancelTrip} // Pass cancel handler
        cancelText={(trip) =>
          trip.bookedSeats && trip.bookedSeats > 0 ? "Cancel & Refund" : "Cancel"
        }
      />
    </div>
  );
};

export default ManageTrips;