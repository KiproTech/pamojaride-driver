import { NavLink, Outlet } from "react-router-dom";
import "./settings.css";

export default function Settings() {
  return (
    <div className="settings-layout">
      <aside className="settings-sidebar">
        <h3>Settings</h3>

        <nav>
          <NavLink to="profile">👤 Profile</NavLink>
          <NavLink to="vehicle">🚗 Vehicle</NavLink>
          <NavLink to="security">🔒 Security</NavLink>
          <NavLink to="privacy">🛡️ Privacy</NavLink>
          <NavLink to="support">💬 Support</NavLink>
        </nav>
      </aside>

      <main className="settings-content">
        <Outlet />
      </main>
    </div>
  );
}
