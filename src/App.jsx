import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";

// Landing
import Landing from "./pages/Landing/Landing";

// Auth pages
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";
import ForgotPassword from "./pages/Login/ForgotPassword";

// Main pages
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageTrips from "./pages/ManageTrips/ManageTrips";
import Bookings from "./pages/Bookings/Bookings";
import TripHistory from "./pages/TripHistory/TripHistory";
import Earnings from "./pages/Earnings/Earnings";
import Ratings from "./pages/Ratings/Ratings";

// Settings pages
import Settings from "./pages/Settings/Settings";
import ProfileSettings from "./pages/Settings/ProfileSettings";
import VehicleSettings from "./pages/Settings/VehicleSettings";
import SecuritySettings from "./pages/Settings/SecuritySettings";
import PrivacySettings from "./pages/Settings/PrivacySettings";
import Support from "./pages/Settings/Support";

export default function App() {
  const { user } = useAuth();

  // ✅ AUTH CHECK (refresh-safe)
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* ================= LANDING ================= */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Landing />
          )
        }
      />

      {/* ================= AUTH ================= */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPassword />
          )
        }
      />

      {/* ================= PROTECTED DASHBOARD ================= */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="trips" element={<ManageTrips />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="history" element={<TripHistory />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="ratings" element={<Ratings />} />

        {/* -------- SETTINGS -------- */}
        <Route path="settings" element={<Settings />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="vehicle" element={<VehicleSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}