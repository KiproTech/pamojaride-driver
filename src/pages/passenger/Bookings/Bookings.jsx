import React from "react";
import ActiveBookings from "./ActiveBookings";
import "./Bookings.css";

const Bookings = () => {
  return (
    <div className="passenger-bookings">
      <h2>My Bookings</h2>
      <ActiveBookings />
      {/* You can add PastBookings later if needed */}
    </div>
  );
};

export default Bookings;