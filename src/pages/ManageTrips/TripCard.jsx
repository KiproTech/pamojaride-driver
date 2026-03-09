const TripCard = ({ trip, onView, onStart, onComplete, onCancel, cancelText }) => {
  if (!trip) return null;

  const STATUS_COLORS = {
    completed: "#10b981", // green
    ongoing: "#facc15",   // yellow
    upcoming: "#3b82f6",  // blue
  };

  const borderColor = STATUS_COLORS[trip.status] || "#6b7280";

  const formattedDate = trip.departure_datetime
    ? new Date(trip.departure_datetime).toLocaleString()
    : "N/A";

  const handleComplete = () => {
    const confirm = window.confirm(
      "Are you sure you want to complete this trip?"
    );
    if (confirm) {
      onComplete(trip.id);
    }
  };

  const handleCancel = () => {
    if (!onCancel || !cancelText) return;

    const confirmMsg =
      cancelText === "Cancel & Refund"
        ? "This trip has passengers. Are you sure you want to cancel and refund?"
        : "Are you sure you want to cancel this trip?";
    const confirmAction = window.confirm(confirmMsg);

    if (confirmAction) {
      onCancel(trip.id, cancelText);
    }
  };

  return (
    <div
      className="trip-card"
      style={{ borderLeft: `5px solid ${borderColor}` }}
    >
      <div className="trip-card-info">
        <h3>
          {trip.start_location} → {trip.end_location}
        </h3>

        <p>
          <strong>Date & Time:</strong> {formattedDate}
        </p>

        <p>
          <strong>Seats:</strong> {trip.seats_available}
        </p>

        <p>
          <strong>Price:</strong> KES {trip.price_per_seat}
        </p>

        <span
          className="trip-status-badge"
          style={{
            backgroundColor: borderColor,
            color: "#fff",
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            display: "inline-block",
            marginTop: "6px",
          }}
        >
          {trip.status.toUpperCase()}
        </span>
      </div>

      <div className="trip-card-actions">
        <button className="view-btn" onClick={() => onView(trip)}>
          View
        </button>

        {trip.status === "upcoming" && (
          <>
            <button className="start-btn" onClick={() => onStart(trip.id)}>
              Start
            </button>
            {cancelText && (
              <button className="cancel-btn" onClick={handleCancel}>
                {cancelText}
              </button>
            )}
          </>
        )}

        {trip.status === "ongoing" && (
          <button className="complete-btn" onClick={handleComplete}>
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default TripCard;