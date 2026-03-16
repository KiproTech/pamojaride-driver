import React from "react";

const TripCard = ({ trip }) => {
  const bookTrip = () => {
    alert(`You have booked the trip: ${trip.from} → ${trip.to} on ${trip.date} at ${trip.time}`);
  };

  const navigateToMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${trip.from}&destination=${trip.to}`;
    window.open(url, "_blank");
  };

  return (
    <div className="trip-card">
      <div className="trip-header">
        <h3>{trip.from} → {trip.to}</h3>
        <span>Seats Left: {trip.seatsLeft}</span>
      </div>
      <p><strong>Date:</strong> {trip.date} at {trip.time}</p>
      <p><strong>Stage:</strong> {trip.stage}</p>
      <p><strong>Amount:</strong> ${trip.amount}</p>
      <p><strong>Driver:</strong> {trip.driver.name} ({trip.driver.phone})</p>
      <p><strong>Vehicle:</strong> {trip.driver.vehicle}</p>

      <div className="trip-actions">
        <button onClick={bookTrip}>Book Trip</button>
        <button onClick={navigateToMap}>View on Map</button>
      </div>
    </div>
  );
};

export default TripCard;