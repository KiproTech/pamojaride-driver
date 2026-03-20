import React, { useEffect, useState } from "react";
import TripCard from "./TripCard";
import { fetchAvailableTrips } from "../../../services/api.js";
import "./Bookings.css";

const ActiveBookings = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await fetchAvailableTrips();
        setTrips(data);
      } catch (err) {
        console.error("Failed to load trips:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.start_location.toLowerCase().includes(search.from.toLowerCase()) &&
      trip.end_location.toLowerCase().includes(search.to.toLowerCase())
  );

  if (loading) return <p>Loading trips...</p>;

  return (
    <div className="available-trips">
      <h2>Available Trips</h2>

      <div className="search-bar">
        <input
          type="text"
          name="from"
          placeholder="From"
          value={search.from}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="to"
          placeholder="To"
          value={search.to}
          onChange={handleSearchChange}
        />
      </div>

      <div className="trips-list">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))
        ) : (
          <p>No trips found.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveBookings;