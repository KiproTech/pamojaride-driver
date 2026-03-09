// src/pages/Dashboard/TripSummary.jsx
const TripSummary = ({ trips = [] }) => {
  if (!Array.isArray(trips) || trips.length === 0) {
    return (
      <div className="trip-summary">
        <h3>Trips</h3>
        <p>No trips available</p>
      </div>
    );
  }

  const openGoogleMaps = (trip) => {
    if (!trip.status || trip.status !== "ongoing") return;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      trip.start_location ?? ""
    )}&destination=${encodeURIComponent(trip.end_location ?? "")}&travelmode=driving`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="trip-summary">
      <h3>Trips</h3>

      <div className="trip-list">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            {/* Trip info */}
            <div className="trip-info">
              <strong className="trip-route">
                {trip.start_location ?? "Unknown"} → {trip.end_location ?? "Unknown"}
              </strong>

              <p className="trip-meta">
                Departure: {trip.departure_datetime ?? "—"}
              </p>

              <p className="trip-meta">
                Seats: {trip.seats_available ?? 0} • Price: KES {trip.price_per_seat ?? "—"}
              </p>
            </div>

            {/* Status + actions */}
            <div className="trip-actions">
              <span className={`status-badge ${trip.status ?? "unknown"}`}>
                {trip.status ?? "unknown"}
              </span>

              <button
                className="map-btn"
                disabled={trip.status !== "ongoing"}
                onClick={() => openGoogleMaps(trip)}
                title={
                  trip.status !== "ongoing"
                    ? "Trip must be ongoing to view map"
                    : "View route on Google Maps"
                }
              >
                View Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripSummary;