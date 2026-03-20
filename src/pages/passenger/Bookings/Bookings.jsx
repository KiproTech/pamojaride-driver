import React from "react";
import ActiveBookings from "./ActiveBookings";
import "./Bookings.css";

const Bookings = () => {
  return (
    <div className="passenger-bookings">
      <h2>My Bookings</h2>

      <div className="bookings-section">
        <ActiveBookings />
      </div>
    </div>
  );
};

export default Bookings;