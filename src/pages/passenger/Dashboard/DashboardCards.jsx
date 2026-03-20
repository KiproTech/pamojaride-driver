import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../../services/api";
import "./dashboard.css";

const DashboardCards = () => {
  const [stats, setStats] = useState({
    tripsThisMonth: 0,
    totalSpend: 0,
    notifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats({
          tripsThisMonth: data?.tripsThisMonth || 0,
          totalSpend: data?.totalSpend || 0,
          notifications: data?.notifications || 0
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;

  return (
    <div className="dashboard-cards">
      <div className="card">
        <h4>Trips This Month</h4>
        <p>{stats.tripsThisMonth}</p>
      </div>

      <div className="card">
        <h4>Total Spend</h4>
        <p>Ksh {stats.totalSpend}</p>
      </div>

      <div className="card">
        <h4>Notifications</h4>
        <p>{stats.notifications}</p>
      </div>
    </div>
  );
};

export default DashboardCards;