import { useState, useEffect } from "react";
import TripDetails from "./TripDetails";
import "./tripHistory.css";

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings/trips/history/with-bookings", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // store token in localStorage
          }
        });
        const data = await res.json();
        if (data.success) setTrips(data.data);
      } catch (err) {
        console.error("Failed to fetch trip history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const filteredTrips = filterDate
    ? trips.filter(trip => trip.departure.startsWith(filterDate))
    : trips;

  return (
    <div className="trip-history-page">
      <h1>Trip History</h1>

      <div className="filter-section">
        <label htmlFor="tripDate">Filter by Date: </label>
        <input
          type="date"
          id="tripDate"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {loading && <p>Loading trip history...</p>}
      {!loading && filteredTrips.length === 0 && <p>No trips found for this date.</p>}

      {filteredTrips.map(trip => (
        <TripDetails key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export default TripHistory;