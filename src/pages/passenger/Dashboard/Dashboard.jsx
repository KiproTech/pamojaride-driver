import React from "react";
import DashboardCards from "./DashboardCards";
import NotificationsPanel from "./NotificationsPanel";
import "./dashboard.css";

const Dashboard = () => {
const trip = {
from: "Nairobi",
to: "Thika",
time: "08:00 AM",
stage: "Kasarani Stage",
driver: "John Doe",
phone: "+254700123456",
seatsLeft: 3,
amount: "$25",
origin: "Kasarani",
destination: "Thika"
};

const openMap = () => {
const url = `https://www.google.com/maps/dir/?api=1&origin=${trip.origin}&destination=${trip.destination}`;
window.open(url, "_blank");
};

return ( <div className="passenger-dashboard">

```
  {/* ================= HEADER ================= */}
  <header className="dashboard-header">

    <div className="header-left">
      <img
        src="/src/assets/images/Pamojaride.png"
        alt="PamojaRide Logo"
        className="dashboard-logo"
      />
      <h2>Welcome back, Passenger!</h2>
    </div>

    <div className="header-right">
      <div className="notifications">
        🔔3
      </div>

      <div className="profile">
        <img
          src="/src/assets/images/default-profile.png"
          alt="Profile"
          className="profile-pic"
        />
        <span>Passenger</span>
      </div>
    </div>

  </header>


  {/* ================= DASHBOARD CONTENT ================= */}
  <div className="dashboard-content">

    {/* SUMMARY CARDS */}
    <div className="dashboard-cards">

      <div className="card">
        <h4>Trips This Month</h4>
        <p>3</p>
      </div>

      <div className="card">
        <h4>Total Spend</h4>
        <p>$250</p>
      </div>

      <div className="card">
        <h4>Notifications</h4>
        <p>2</p>
      </div>

    </div>


    {/* ================= UPCOMING / ONGOING TRIP ================= */}
    <div className="trip-card">

      <div className="trip-header">
        <h3>Upcoming Trip</h3>
        <span className="trip-status">Scheduled</span>
      </div>


      {/* ROUTE */}
      <div className="trip-route">

        <div className="route-point">
          <span className="dot start"></span>
          <p>{trip.from}</p>
        </div>

        <div className="route-line"></div>

        <div className="route-point">
          <span className="dot end"></span>
          <p>{trip.to}</p>
        </div>

      </div>


      {/* TRIP DETAILS */}
      <div className="trip-details">
        <p><strong>Departure:</strong> {trip.time}</p>
        <p><strong>Stage:</strong> {trip.stage}</p>
        <p><strong>Seats Left:</strong> {trip.seatsLeft}</p>
        <p><strong>Amount Paid:</strong> {trip.amount}</p>
      </div>


      {/* DRIVER SECTION */}
      <div className="driver-section">

        <div className="driver-info">
          <img
            src="/src/assets/images/default-profile.png"
            alt="Driver"
            className="driver-pic"
          />

          <div>
            <p className="driver-name">{trip.driver}</p>
            <p className="driver-phone">{trip.phone}</p>
          </div>
        </div>

        <a href={`tel:${trip.phone}`} className="call-driver">
          Call Driver
        </a>

      </div>


      {/* MAP NAVIGATION */}
      <button className="navigate-btn" onClick={openMap}>
        Navigate to Pickup
      </button>

    </div>


    {/* ================= NOTIFICATIONS ================= */}
    <NotificationsPanel />

  </div>

</div>
);
};

export default Dashboard;
