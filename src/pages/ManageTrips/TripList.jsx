import TripCard from "./TripCard";

const TripList = ({ trips = [], onView, onStart, onComplete, onCancel }) => {
  const tripsArray = Array.isArray(trips) ? trips : [];

  const sections = [
    { title: "Ongoing Trips", status: "ongoing" },
    { title: "Upcoming Trips", status: "upcoming" },
    { title: "Completed Trips", status: "completed" },
  ];

  const hasTrips = tripsArray.length > 0;

  return (
    <div className="trip-list">
      {!hasTrips && <p>No trips available.</p>}

      {sections.map(({ title, status }) => {
        const filteredTrips = tripsArray.filter((t) => t.status === status);

        if (filteredTrips.length === 0) return null;

        return (
          <div key={status} className="trip-section">
            <h3 className="trip-section-title">{title}</h3>

            {filteredTrips.map((trip) => {
              // Determine cancel button text
              let cancelText = null;
              if (status === "upcoming") {
                cancelText =
                  trip.bookedSeats && trip.bookedSeats > 0
                    ? "Cancel & Refund"
                    : "Cancel Trip";
              }

              return (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onView={onView}
                  onStart={onStart}
                  onComplete={onComplete}
                  onCancel={cancelText ? () => onCancel(trip.id, cancelText) : undefined}
                  cancelText={cancelText} // Pass text to TripCard
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default TripList;