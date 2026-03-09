// src/pages/Dashboard/DashboardMap.jsx
const DashboardMap = ({ trips = [] }) => {
  // Ensure trips is always an array
  const safeTrips = Array.isArray(trips) ? trips : [];

  // Filter only ongoing trips
  const ongoingTrips = safeTrips.filter((trip) => trip.status === "ongoing");

  if (ongoingTrips.length === 0) {
    return (
      <div className="dashboard-map empty">
        <p>No ongoing trips right now.</p>
      </div>
    );
  }

  const openGoogleMaps = (trip) => {
    const { start_location, end_location } = trip;
    if (!start_location || !end_location) return;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      start_location
    )}&destination=${encodeURIComponent(end_location)}&travelmode=driving`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="dashboard-map">
      <h3>Live Trips</h3>
      <div className="map-trip-list">
        {ongoingTrips.map((trip) => (
          <div key={trip.id ?? Math.random()} className="map-trip-card">
            <div className="map-trip-info">
              <strong>
                {trip.start_location ?? "Unknown"} →{" "}
                {trip.end_location ?? "Unknown"}
              </strong>
              <p>
                Seats Available: <b>{trip.seats_available ?? 0}</b>
              </p>
              <p>
                Departure:{" "}
                <b>
                  {trip.departure_datetime
                    ? new Date(trip.departure_datetime).toLocaleString()
                    : "—"}
                </b>
              </p>
            </div>

            <button
              className="map-btn"
              onClick={() => openGoogleMaps(trip)}
              title="Open route in Google Maps"
            >
              View Route
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMap;