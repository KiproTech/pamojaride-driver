import { Routes, Route, Navigate } from "react-router-dom";

/* Layouts */
import DashboardLayout from "./layouts/DashboardLayout";
import PassengerDashboardLayout from "./layouts/PassengerDashboardLayout";

/* Protected Route */
import ProtectedRoute from "./routes/ProtectedRoute";

/* Landing / Auth */
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";

/* Driver Pages */
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageTrips from "./pages/ManageTrips/ManageTrips";
import Bookings from "./pages/Bookings/Bookings";
import TripHistory from "./pages/TripHistory/TripHistory";
import Earnings from "./pages/Earnings/Earnings";
import Ratings from "./pages/Ratings/Ratings";

/* Driver Settings */
import Settings from "./pages/Settings/Settings";
import ProfileSettings from "./pages/Settings/ProfileSettings";
import VehicleSettings from "./pages/Settings/VehicleSettings";
import SecuritySettings from "./pages/Settings/SecuritySettings";
import PrivacySettings from "./pages/Settings/PrivacySettings";
import Support from "./pages/Settings/Support";

/* Passenger Pages */
import PassengerLanding from "./pages/passenger/Landing/Landing";
import PassengerLogin from "./pages/passenger/Login/Login";
import PassengerSignup from "./pages/passenger/Signup/Signup";
import PassengerForgotPassword from "./pages/passenger/Login/ForgotPassword";
import PassengerResetPassword from "./pages/passenger/Login/ResetPassword";
import PassengerDashboard from "./pages/passenger/Dashboard/Dashboard";
import PassengerProfile from "./pages/passenger/Profile/Profile";
import PassengerSupport from "./pages/passenger/Support/Support";
import AvailableTrips from "./pages/passenger/Bookings/Bookings";
import PassengerTripHistory from "./pages/passenger/History/PassengerTripHistory";

export default function App() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAuthenticated = Boolean(token);

  return (
    <Routes>

      {/* ================= LANDING ================= */}

      <Route
        path="/"
        element={
          isAuthenticated
            ? role === "driver"
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/passenger/dashboard" replace />
            : <Landing />
        }
      />

      {/* ================= DRIVER AUTH ================= */}

      <Route
        path="/login"
        element={
          isAuthenticated && role === "driver"
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated && role === "driver"
            ? <Navigate to="/dashboard" replace />
            : <Signup />
        }
      />

      <Route
        path="/forgot-password"
        element={
          isAuthenticated && role === "driver"
            ? <Navigate to="/dashboard" replace />
            : <ForgotPassword />
        }
      />

      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ================= DRIVER DASHBOARD ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="driver">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="trips" element={<ManageTrips />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="history" element={<TripHistory />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="ratings" element={<Ratings />} />

        <Route path="settings" element={<Settings />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="vehicle" element={<VehicleSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Route>

      {/* ================= PASSENGER LANDING ================= */}

      <Route
        path="/passenger"
        element={
          isAuthenticated && role === "passenger"
            ? <Navigate to="/passenger/dashboard" replace />
            : <PassengerLanding />
        }
      />

      {/* ================= PASSENGER AUTH ================= */}

      <Route
        path="/passenger/login"
        element={
          isAuthenticated && role === "passenger"
            ? <Navigate to="/passenger/dashboard" replace />
            : <PassengerLogin />
        }
      />

      <Route
        path="/passenger/signup"
        element={
          isAuthenticated && role === "passenger"
            ? <Navigate to="/passenger/dashboard" replace />
            : <PassengerSignup />
        }
      />

      <Route path="/passenger/forgot-password" element={<PassengerForgotPassword />} />

      <Route path="/passenger/reset-password" element={<PassengerResetPassword />} />

      {/* ================= PASSENGER DASHBOARD ================= */}

      <Route
        path="/passenger/dashboard"
        element={
          <ProtectedRoute role="passenger">
            <PassengerDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PassengerDashboard />} />
        <Route path="bookings" element={<AvailableTrips />} />
        <Route path="history" element={<PassengerTripHistory />} />
        <Route path="profile" element={<PassengerProfile />} />
        <Route path="support" element={<PassengerSupport />} />
      </Route>

      {/* ================= FALLBACK ================= */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
