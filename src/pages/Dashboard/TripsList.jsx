// src/pages/Dashboard/TripsList.jsx
const TripsList = ({ trips = [] }) => {
  const safeTrips = Array.isArray(trips) ? trips : [];

  if (safeTrips.length === 0) {
    return (
      <div className="trip-summary">
        <h3>Today’s Trips</h3>
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
      <h3>Today’s Trips</h3>

      <ul className="trip-list">
        {safeTrips.map((trip) => (
          <li key={trip.id} className="trip-card">
            <div className="trip-info">
              <strong>
                {trip.start_location ?? "Unknown"} → {trip.end_location ?? "Unknown"}
              </strong>

              <p className="trip-meta">
                Departure: {trip.departure_datetime ?? "—"}
              </p>

              <p className="trip-meta">
                Seats: {trip.seats_available ?? 0} • Price: KES {trip.price_per_seat ?? "—"}
              </p>

              <p className="trip-meta">
                Status:{" "}
                <span className={`status-badge ${trip.status ?? "unknown"}`}>
                  {trip.status ?? "unknown"}
                </span>
              </p>
            </div>

            <button
              className="map-btn"
              disabled={trip.status !== "ongoing"}
              onClick={() => openGoogleMaps(trip)}
              title={
                trip.status !== "ongoing"
                  ? "Trip must be ongoing to open map"
                  : "Open route in Google Maps"
              }
            >
              Open Map
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripsList;