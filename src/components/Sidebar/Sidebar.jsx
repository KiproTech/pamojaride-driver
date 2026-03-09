import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      style={{
        ...styles.sidebar,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <NavLink to="." end style={navStyle}>Dashboard</NavLink>
      <NavLink to="trips" style={navStyle}>Manage Trips</NavLink>
      <NavLink to="bookings" style={navStyle}>Bookings</NavLink>
      <NavLink to="history" style={navStyle}>Trip History</NavLink>
      <NavLink to="Earnings" style={navStyle}>Earnings</NavLink>
      <NavLink to="ratings" style={navStyle}>Ratings</NavLink>
      <NavLink to="settings" style={navStyle}>Settings</NavLink>
            
    </aside>
  );
};

const navStyle = ({ isActive }) => ({
  display: "block",
  color: isActive ? "#38bdf8" : "white",
  textDecoration: "none",
  marginBottom: "12px",
  fontWeight: isActive ? "bold" : "normal",
});

const styles = {
  sidebar: {
    position: "fixed",
    top: "60px",
    left: 0,
    width: "240px",
    height: "calc(100vh - 60px)",
    background: "#1e293b",
    padding: "20px",
    transition: "transform 0.3s ease",
    zIndex: 999,
  },
};

export default Sidebar;
