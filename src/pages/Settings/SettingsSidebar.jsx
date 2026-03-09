import { NavLink } from "react-router-dom";
import { FaUser, FaCar, FaLock, FaShieldAlt, FaHeadset } from "react-icons/fa";
import "./settings.css";

const links = [
  { to: "profile", icon: <FaUser />, label: "Profile" },
  { to: "vehicle", icon: <FaCar />, label: "Vehicle" },
  { to: "security", icon: <FaLock />, label: "Security" },
  { to: "privacy", icon: <FaShieldAlt />, label: "Privacy" },
  { to: "support", icon: <FaHeadset />, label: "Support" },
];

export default function SettingsSidebar() {
  return (
    <div className="settings-sidebar">
      {links.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
          {icon} {label}
        </NavLink>
      ))}
    </div>
  );
}