import { useState } from "react";
import PassengerListTable from "./PassengerListTable";
import DownloadTripReport from "./DownloadTripReport";

const TripHistoryTable = ({ trips }) => {
  const [expandedTrip, setExpandedTrip] = useState(null);

  const toggleTrip = (tripId) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  if (!trips || trips.length === 0) {
    return <p>No trip history available.</p>;
  }

  return (
    <div>
      <table className="trip-passenger-table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Departure</th>
            <th>Passengers</th>
            <th>Total Collected</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => (
            <>
              <tr key={trip.id}>
                <td>{trip.route}</td>

                <td>
                  {new Date(trip.departure).toLocaleString()}
                </td>

                <td>{trip.passengers.length}</td>

                <td>KES {trip.totalCollected}</td>

                <td>
                  <button
                    onClick={() => toggleTrip(trip.id)}
                    className="download-btn"
                  >
                    {expandedTrip === trip.id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>

              {expandedTrip === trip.id && (
                <tr>
                  <td colSpan="5">
                    <DownloadTripReport trip={trip} />
                    <PassengerListTable passengers={trip.passengers} />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripHistoryTable;