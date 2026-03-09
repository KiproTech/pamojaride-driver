import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/Pamojaride.png";
import defaultProfile from "../../assets/images/default-profile.png";
import "./Topbar.css";

const Topbar = ({ toggleSidebar, pageTitle = "Dashboard", notifications = [] }) => {
  const [status, setStatus] = useState("Available");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfile);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle availability status
  const handleStatusToggle = () => {
    setStatus((prev) => (prev === "Available" ? "Busy" : "Available"));
  };

  // Load user and profile image
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.profile_picture) {
        setProfileImage(parsedUser.profile_picture);
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate to profile
  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/dashboard/settings/profile");
  };

  // Logout
 const handleLogout = () => {
  // Clear all auth/session data
  localStorage.clear();
  sessionStorage.clear();

  // Force full reload to login page
  window.location.replace("/login");
};


  return (
    <header className="topbar">
      <div className="topbar-left">
        <button onClick={toggleSidebar} className="menu-btn">☰</button>
        <img src={logo} alt="PamojaRide Logo" className="topbar-logo" />
        <span className="system-name">PamojaRide</span>
      </div>

      <div className="topbar-center">
        <span className="page-title">{pageTitle}</span>
      </div>

      <div className="topbar-right">
        <div className="notification">
          🔔
          {notifications.length > 0 && (
            <span className="badge">{notifications.length}</span>
          )}
        </div>

        <div className="status" onClick={handleStatusToggle}>
          {status}
        </div>

        <div className="profile" ref={dropdownRef}>
          <img
            src={profileImage || defaultProfile}
            alt={user?.full_name || "User"}
            className="profile-pic"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          <span onClick={() => setDropdownOpen((prev) => !prev)}>
            {user?.full_name || "User"} ▼
          </span>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item" onClick={goToProfile}>
                Profile
              </button>
              <button className="dropdown-item logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
