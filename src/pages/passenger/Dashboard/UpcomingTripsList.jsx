import React from "react";
import "./dashboard.css";

const upcomingTrips = [
  {
    id: "TRP001",
    from: "Nairobi",
    to: "Mombasa",
    startStage: "Nairobi CBD",
    endStage: "Mombasa Central",
    date: "2026-03-15",
    time: "08:00 AM",
    seatsBooked: 2,
    seatsLeft: 3,
    amount: 120,
    driver: {
      name: "John Doe",
      phone: "+254712345678",
      vehicle: "Toyota Hiace - KBA123A"
    },
    status: "Confirmed"
  },
  {
    id: "TRP002",
    from: "Nairobi",
    to: "Nakuru",
    startStage: "Kilimani",
    endStage: "Nakuru Town",
    date: "2026-03-18",
    time: "09:30 AM",
    seatsBooked: 1,
    seatsLeft: 4,
    amount: 80,
    driver: {
      name: "Mary Wanjiku",
      phone: "+254798765432",
      vehicle: "Toyota Coaster - KBC456B"
    },
    status: "Booked"
  }
];

const UpcomingTripsList = () => {
  return (
    <div className="upcoming-trips">
      <h3>Upcoming Trips</h3>
      {upcomingTrips.map((trip) => (
        <div key={trip.id} className="trip-card">
          <div className="trip-header">
            <span>{trip.from} → {trip.to}</span>
            <span className={`trip-status ${trip.status.toLowerCase()}`}>
              {trip.status}
            </span>
          </div>
          <div className="trip-details">
            <p><strong>Date:</strong> {trip.date} at {trip.time}</p>
            <p><strong>Start Stage:</strong> {trip.startStage}</p>
            <p><strong>Driver:</strong> {trip.driver.name} ({trip.driver.phone})</p>
            <p><strong>Vehicle:</strong> {trip.driver.vehicle}</p>
            <p><strong>Seats Booked:</strong> {trip.seatsBooked} | <strong>Seats Left:</strong> {trip.seatsLeft}</p>
            <p><strong>Amount:</strong> ${trip.amount}</p>
          </div>
          <div className="trip-actions">
            <button>View on Map</button>
            <button>Cancel Trip</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingTripsList;