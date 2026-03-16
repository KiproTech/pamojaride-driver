// src/layouts/PassengerDashboardLayout.jsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import TopbarPassenger from "../components/Topbar/TopbarPassenger";

const SIDEBAR_WIDTH = 220;
const TOPBAR_HEIGHT = 60;

const PassengerDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px 15px",
    textDecoration: "none",
    color: isActive ? "#10b981" : "#111",
    fontWeight: isActive ? "700" : "500",
    borderRadius: "6px",
    marginBottom: "10px",
    backgroundColor: isActive ? "rgba(16,185,129,0.1)" : "transparent",
  });

  return (
    <div>
      <TopbarPassenger toggleSidebar={toggleSidebar} />

      <div style={{ display: "flex", marginTop: TOPBAR_HEIGHT }}>
        {sidebarOpen && (
          <aside
            style={{
              width: SIDEBAR_WIDTH,
              backgroundColor: "#f3f4f6",
              height: "100vh",
              position: "fixed",
              top: TOPBAR_HEIGHT,
              left: 0,
              padding: "20px",
              boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
          >
            <nav>
              <ul style={{ listStyle: "none", padding: 0 }}>

                <li>
                  <NavLink to="/passenger/dashboard" style={linkStyle}>
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/passenger/dashboard/bookings" style={linkStyle}>
                    Bookings
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/passenger/dashboard/history" style={linkStyle}>
                    History
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/passenger/dashboard/profile" style={linkStyle}>
                    Profile
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/passenger/dashboard/support" style={linkStyle}>
                    Support
                  </NavLink>
                </li>

              </ul>
            </nav>
          </aside>
        )}

        <main
          style={{
            marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
            padding: "20px",
            width: "100%",
            transition: "margin-left 0.3s ease",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PassengerDashboardLayout;
