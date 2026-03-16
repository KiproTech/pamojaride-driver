// src/components/Topbar/TopbarPassenger.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/Pamojaride.png";
import { clearToken, getImageUrl } from "../../services/api";
import { usePassenger } from "../../context/PassengerContext"; // <-- correct import
import "./TopbarPassenger.css";

const TopbarPassenger = ({ toggleSidebar }) => {
  const { passenger } = usePassenger(); // <-- updated hook usage
  const [notifications, setNotifications] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const profileRef = useRef();
  const notifRef = useRef();
  const navigate = useNavigate();

  const userName = passenger?.full_name || "Passenger";

  const profilePicture = passenger?.profile_picture
    ? getImageUrl(passenger.profile_picture)
    : "/src/assets/images/default-profile.png";

  // -----------------------------
  // Close dropdowns on outside click
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------
  // Logout & Profile navigation
  // -----------------------------
  const handleLogout = () => {
    clearToken();
    navigate("/passenger/login");
  };

  const goToProfile = () => {
    setShowProfileDropdown(false);
    navigate("/passenger/dashboard/profile");
  };

  return (
    <div className="topbar topbar-passenger">
      <div className="topbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>☰</button>
        <img src={logo} alt="PamojaRide Logo" className="topbar-logo" />
        <span className="system-name">PamojaRide</span>
      </div>

      <div className="topbar-center">
        <span className="page-title">Welcome back, {userName}!</span>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <div
          className="notification"
          ref={notifRef}
          onClick={() => setShowNotifications(prev => !prev)}
        >
          🔔
          {notifications.length > 0 && <span className="badge">{notifications.length}</span>}

          {showNotifications && (
            <div className="profile-dropdown notification-dropdown">
              {notifications.length
                ? notifications.map((n) => (
                    <div key={n.id} className="notification-item">
                      {n.message}
                    </div>
                  ))
                : <div className="notification-item">No new notifications</div>}
            </div>
          )}
        </div>

        <div className="status">Online</div>

        {/* Profile */}
        <div
          className="profile"
          ref={profileRef}
          onClick={() => setShowProfileDropdown(prev => !prev)}
        >
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-pic"
            loading="lazy"
            onError={() => setAvatarError(true)}
            style={{ display: avatarError ? "none" : "block" }}
          />

          {avatarError && (
            <img
              src="/src/assets/images/default-profile.png"
              alt="Default Avatar"
              className="profile-pic"
            />
          )}

          {userName}

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <button onClick={goToProfile}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopbarPassenger;