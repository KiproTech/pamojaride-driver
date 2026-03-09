// src/pages/Dashboard/DashboardNotifications.jsx
const DashboardNotifications = ({ notifications = [] }) => {
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  if (safeNotifications.length === 0) {
    return (
      <div className="dashboard-notifications">
        <h3>Notifications</h3>
        <p className="empty-notifications">No notifications yet</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString(); // e.g., 3/1/2026, 4:05:00 PM
  };

  return (
    <div className="dashboard-notifications">
      <h3>Notifications</h3>
      <ul>
        {safeNotifications.map((item) => (
          <li
            key={item.id ?? Math.random()}
            className={item.is_read ? "read" : "unread"} // highlight unread
          >
            {item.title && <strong>{item.title}: </strong>}
            <span>{item.message ?? "No message"}</span>
            {item.created_at && (
              <small style={{ marginLeft: "10px", color: "#666" }}>
                {formatDate(item.created_at)}
              </small>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardNotifications;