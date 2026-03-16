import React from "react";
import "./dashboard.css";

// Sample notifications; later these can come from an API
const notifications = [
  { id: 1, message: "Your trip to Mombasa is confirmed.", time: "2h ago" },
  { id: 2, message: "New driver assigned for Nairobi → Nakuru.", time: "5h ago" },
];

const NotificationsPanel = () => {
  return (
    <div className="notifications-panel">
      <h3>Notifications</h3>
      <ul>
        {notifications.map((note) => (
          <li key={note.id}>
            <span>{note.message}</span>
            <small>{note.time}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;