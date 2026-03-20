import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../../../services/api";
import "./dashboard.css";

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); // controls panel visibility

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load notifications:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const togglePanel = () => setVisible((prev) => !prev);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="notifications-wrapper">
      {/* Notification bell / toggle */}
      <button className="notifications-toggle" onClick={togglePanel}>
        🔔 {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </button>

      {/* Notification panel */}
      {visible && (
        <div className="notifications-panel">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul>
              {notifications.map((note, idx) => (
                <li key={note.id || idx} className="notification-item">
                  <span className="notification-message">{note.message || "No message"}</span>
                  {note.time && (
                    <small className="notification-time">
                      {new Date(note.time).toLocaleString([], {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;