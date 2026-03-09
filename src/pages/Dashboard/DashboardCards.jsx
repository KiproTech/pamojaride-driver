// src/pages/Dashboard/DashboardCards.jsx
const DashboardCards = ({ data = {} }) => {
  // Use backend keys and safe defaults
  const completed = Number(data.completed_trips) || 0;
  const ongoing = Array.isArray(data.ongoing_trips) ? data.ongoing_trips.length : 0;
  const upcoming = Number(data.upcoming_trips) || 0;
  const earningsToday = Number(data.earnings_today) || 0;

  const formattedEarnings = earningsToday.toLocaleString("en-KE");

  return (
    <div className="dashboard-cards">
      <div className="card completed">
        <div className="card-header">✅ Completed Trips</div>
        <div className="card-value">{completed}</div>
      </div>

      <div className="card ongoing">
        <div className="card-header">🚗 Ongoing Trips</div>
        <div className="card-value">{ongoing}</div>
      </div>

      <div className="card upcoming">
        <div className="card-header">📅 Upcoming Trips</div>
        <div className="card-value">{upcoming}</div>
      </div>

      <div className="card earnings">
        <div className="card-header">💰 Earnings Today</div>
        <div className="card-value">KES {formattedEarnings}</div>
      </div>
    </div>
  );
};

export default DashboardCards;