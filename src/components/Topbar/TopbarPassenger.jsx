// src/components/Topbar/TopbarPassenger.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/Pamojaride.png";
import { clearToken, getImageUrl, fetchNotifications, markAllNotificationsAsRead } from "../../services/api";
import { usePassenger } from "../../context/PassengerContext";
import "./TopbarPassenger.css";

const TopbarPassenger = ({ toggleSidebar }) => {
  const { passenger } = usePassenger();
  const [notifications, setNotifications] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [loadingMarkRead, setLoadingMarkRead] = useState(false);

  const profileRef = useRef();
  const notifRef = useRef();
  const navigate = useNavigate();

  const userName = passenger?.full_name || "Passenger";
  const profilePicture = passenger?.profile_picture
    ? getImageUrl(passenger.profile_picture)
    : "/src/assets/images/default-profile.png";

  // Close dropdowns on outside click
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

  // Fetch notifications
  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notifications:", err.message);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Logout & Profile navigation
  const handleLogout = () => {
    clearToken();
    navigate("/passenger/login");
  };

  const goToProfile = () => {
    setShowProfileDropdown(false);
    navigate("/passenger/dashboard/profile");
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    if (!notifications.length) return;

    try {
      setLoadingMarkRead(true);
      const res = await markAllNotificationsAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      } else {
        console.error(res.message || "Failed to mark notifications as read");
      }
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    } finally {
      setLoadingMarkRead(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}

          {showNotifications && (
            <div className="profile-dropdown notification-dropdown">
              <div className="notif-header">
                <strong>Notifications</strong>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={loadingMarkRead}
                    className="mark-read-btn"
                  >
                    {loadingMarkRead ? "Marking..." : "Mark all as read"}
                  </button>
                )}
              </div>

              <ul className="notif-list">
                {notifications.length ? (
                  notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`notification-item ${n.is_read ? "read" : "unread"}`}
                    >
                      <span>{n.message}</span>
                      {n.created_at && (
                        <small>
                          {new Date(n.created_at).toLocaleString([], {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="notification-item">No new notifications</li>
                )}
              </ul>
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