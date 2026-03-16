import React from "react";
import "./dashboard.css";

const DashboardCards = () => {
  // Placeholder stats; can be dynamically fetched from an API later
  const stats = {
    tripsThisMonth: 3,
    totalSpend: 250,
    notifications: 2
  };

  return (
    <div className="dashboard-cards">
      <div className="card">
        <h4>Trips This Month</h4>
        <p>{stats.tripsThisMonth}</p>
      </div>

      <div className="card">
        <h4>Total Spend</h4>
        <p>${stats.totalSpend}</p>
      </div>

      <div className="card">
        <h4>Notifications</h4>
        <p>{stats.notifications}</p>
      </div>
    </div>
  );
};

export default DashboardCards;