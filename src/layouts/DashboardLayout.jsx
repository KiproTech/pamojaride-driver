import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";

const SIDEBAR_WIDTH = 240;
const TOPBAR_HEIGHT = 60;

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div>
      {/* Topbar */}
      <Topbar toggleSidebar={toggleSidebar} />

      <div style={{ display: "flex", marginTop: TOPBAR_HEIGHT }}>
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content */}
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

export default DashboardLayout;
