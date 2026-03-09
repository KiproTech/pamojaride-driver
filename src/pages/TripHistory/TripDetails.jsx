import { useState } from "react";
import PassengerListTable from "./PassengerListTable";
import DownloadTripReport from "./DownloadTripReport";

const TripDetails = ({ trip }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="trip-card">
      <div className="trip-summary" onClick={() => setExpanded(prev => !prev)}>
        <div><strong>{trip.route}</strong></div>
        <div>Departure: {new Date(trip.departure).toLocaleString()}</div>
        <div>Total Collected: KES {trip.totalCollected}</div>
        <div>
          Archived At: {trip.archivedAt ? new Date(trip.archivedAt).toLocaleString() : "-"}
        </div>
        <div className="expand-icon">{expanded ? "▲" : "▼"}</div>
      </div>

      {expanded && (
        <div className="trip-details">

          <DownloadTripReport trip={trip} />

          <PassengerListTable passengers={trip.passengers} />

        </div>
      )}
    </div>
  );
};

export default TripDetails;