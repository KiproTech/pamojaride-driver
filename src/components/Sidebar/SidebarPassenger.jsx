// src/components/Sidebar/SidebarPassenger.jsx
import { NavLink } from "react-router-dom";
import "./SidebarPassenger.css";

const SidebarPassenger = ({ isOpen }) => {
  return (
    <aside className={`sidebar-passenger ${isOpen ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <NavLink to="/passenger/dashboard" className="sidebar-link">
          🏠 Dashboard
        </NavLink>
        <NavLink to="/passenger/book-trip" className="sidebar-link">
          🚗 Book Trip
        </NavLink>
        <NavLink to="/passenger/bookings" className="sidebar-link">
          📋 My Bookings
        </NavLink>
        <NavLink to="/passenger/profile" className="sidebar-link">
          👤 Profile
        </NavLink>
        <NavLink to="/passenger/support" className="sidebar-link">
          🛠 Support
        </NavLink>
      </nav>
    </aside>
  );
};

export default SidebarPassenger;



