// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect, useCallback } from "react";
import "./dashboard.css";

import DashboardCards from "./DashboardCards";
import TripsList from "./TripsList";
import DashboardNotifications from "./DashboardNotifications";
import DashboardMap from "./DashboardMap";

import { fetchDashboard } from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    completed_trips: 0,
    ongoing_trips: [],
    upcoming_trips: 0,
    earnings_today: 0,
    notifications: [],
  });

  // ---------- Fetch dashboard data ----------
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDashboard(); // token handled internally

      if (res) {
        // res is already normalized
        setDashboardData({
          completed_trips: res.completed_trips ?? 0,
          ongoing_trips: Array.isArray(res.ongoing_trips)
            ? res.ongoing_trips
            : [],
          upcoming_trips: res.upcoming_trips ?? 0,
          earnings_today: res.earnings_today ?? 0,
          notifications: Array.isArray(res.notifications)
            ? res.notifications
            : [],
        });

        console.log("Dashboard data loaded:", res); // ✅ Debug
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- Fetch once on mount ----------
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------- Optional: Auto-refresh every 10s ----------
  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div className="dashboard-page">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {loading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <h2>Dashboard</h2>

          {/* Dashboard Cards */}
          <DashboardCards data={dashboardData} />

          {/* Map showing live/ongoing trips */}
          <DashboardMap trips={dashboardData.ongoing_trips} />

          {/* Today’s Trips List */}
          <TripsList trips={dashboardData.ongoing_trips} />

          {/* Notifications */}
          <DashboardNotifications notifications={dashboardData.notifications} />
        </>
      )}
    </div>
  );
};

export default Dashboard;