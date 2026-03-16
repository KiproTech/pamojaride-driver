import React, { useState } from "react";
import TripCard from "./TripCard";
import "./Bookings.css";

const initialTrips = [
  {
    id: "TRP001",
    from: "Nairobi",
    to: "Mombasa",
    date: "2026-03-15",
    time: "08:00 AM",
    stage: "Nairobi CBD",
    seatsLeft: 3,
    amount: 120,
    driver: {
      name: "John Doe",
      phone: "+254712345678",
      vehicle: "Toyota Hiace - KBA123A"
    }
  },
  {
    id: "TRP002",
    from: "Nairobi",
    to: "Nakuru",
    date: "2026-03-18",
    time: "09:30 AM",
    stage: "Kilimani",
    seatsLeft: 4,
    amount: 80,
    driver: {
      name: "Mary Wanjiku",
      phone: "+254798765432",
      vehicle: "Toyota Coaster - KBC456B"
    }
  },
];

const AvailableTrips = () => {
  const [trips, setTrips] = useState(initialTrips);
  const [search, setSearch] = useState({ from: "", to: "" });

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.from.toLowerCase().includes(search.from.toLowerCase()) &&
      trip.to.toLowerCase().includes(search.to.toLowerCase())
  );

  return (
    <div className="available-trips">
      <h2>Available Trips</h2>

      {/* Search */}
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

      {/* Trip Cards */}
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

export default AvailableTrips;