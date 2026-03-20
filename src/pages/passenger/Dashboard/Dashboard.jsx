import React, { useEffect, useState } from "react";
import DashboardCards from "./DashboardCards";
import CurrentTrip from "./CurrentTrip";
import UpcomingTripsList from "./UpcomingTripsList";
import NotificationsPanel from "./NotificationsPanel";
import PastTripsList from "./PastTripsList";
import {
  fetchDashboardStats,
  fetchCurrentTrip,
  fetchUpcomingTrips,
  fetchPastTrips,
  fetchNotifications
} from "../../../services/api";
import "./dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          statsData,
          currentTripData,
          upcomingTripsData,
          pastTripsData,
          notificationsData
        ] = await Promise.all([
          fetchDashboardStats(),
          fetchCurrentTrip(),
          fetchUpcomingTrips(),
          fetchPastTrips(),
          fetchNotifications()
        ]);

        setStats(statsData);
        setCurrentTrip(currentTripData);
        setUpcomingTrips(upcomingTripsData || []);
        setPastTrips(pastTripsData || []);
        setNotifications(notificationsData || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-main">
      {/* --- Stats Cards --- */}
      <DashboardCards stats={stats} />

      {/* --- Current Active Trip --- */}
      <CurrentTrip trip={currentTrip} />

      {/* --- Upcoming Trips --- */}
      <UpcomingTripsList
        trips={upcomingTrips}
        setTrips={setUpcomingTrips}
      />

      {/* --- Past Trips --- */}
      <PastTripsList trips={pastTrips} />

      {/* --- Notifications --- */}
      <NotificationsPanel notifications={notifications} />
    </div>
  );
};

export default Dashboard;