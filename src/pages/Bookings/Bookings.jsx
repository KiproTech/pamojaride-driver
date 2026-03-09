import { useEffect, useState } from "react";
import UpcomingTripCard from "./UpcomingTripCard";
import { apiRequest } from "../../services/api";
import "./bookings.css";

const Bookings = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch trips only (without bookings)
  const fetchTrips = async () => {
    setLoading(true);
    setError("");

    try {
      const tripsRes = await apiRequest("/trips");
      const tripsData = Array.isArray(tripsRes?.data) ? tripsRes.data : [];

      setTrips(
        tripsData.map((trip) => ({
          ...trip,
          seats_available: trip.seats_available ?? 0,
          price_per_seat: trip.price_per_seat ?? 0,
        }))
      );
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError(`Failed to fetch trips: ${err.message}`);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle a booking cancellation for a specific trip
  const handleBookingCancelled = (tripId, cancelledBooking) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== tripId) return trip;

        const seatsAvailable = (trip.seats_available ?? 0) + 1;

        return {
          ...trip,
          seats_available: seatsAvailable,
        };
      })
    );
  };

  if (loading) return <div>Loading trips...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!trips.length) return <div>No trips found.</div>;

  return (
    <div className="bookings-page">
      <h1>Bookings</h1>
      <div className="trips-container">
        {trips.map((trip) => (
          <UpcomingTripCard
            key={trip.id}
            trip={trip}
            onBookingCancelled={(booking) =>
              handleBookingCancelled(trip.id, booking)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Bookings;