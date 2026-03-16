// src/pages/passenger/History/PassengerTripHistory.jsx
import React, { useEffect, useState } from "react";
import "./PassengerTripHistory.css";

const PassengerTripHistory = () => {
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake fetch for demo purposes
  useEffect(() => {
    setTimeout(() => {
      setPastTrips([
        {
          id: 1,
          from: "Nairobi",
          to: "Mombasa",
          date: "2026-03-01",
          time: "08:00 AM",
          amount: 25,
          driver: { name: "John Doe", phone: "+254700123456" },
          status: "Completed",
        },
        {
          id: 2,
          from: "Nairobi",
          to: "Nakuru",
          date: "2026-03-05",
          time: "09:30 AM",
          amount: 20,
          driver: { name: "Mary Wanjiku", phone: "+254798765432" },
          status: "Completed",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p>Loading your trip history...</p>;

  return (
    <div className="passenger-trip-history">
      <h2>Past Trips</h2>
      {pastTrips.length === 0 ? (
        <p>No past trips found.</p>
      ) : (
        pastTrips.map((trip) => (
          <div key={trip.id} className="trip-card past">
            <h3>
              {trip.from} → {trip.to}
            </h3>
            <p>
              <strong>Date:</strong> {trip.date} at {trip.time}
            </p>
            <p>
              <strong>Amount Paid:</strong> ${trip.amount}
            </p>
            <p>
              <strong>Driver:</strong> {trip.driver.name} ({trip.driver.phone})
            </p>
            <p>
              <strong>Status:</strong> {trip.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default PassengerTripHistory