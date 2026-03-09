const EarningsDetails = ({ trip, onClose }) => {
  if (!trip) return null;

  return (
    <div className="modal">
      <h3>
        Trip Details: {trip.start} → {trip.destination}
      </h3>
      <p>
        <strong>Date:</strong> {trip.date}
        <br />
        <strong>Passengers:</strong> {trip.passengers}
        <br />
        <strong>Total Earnings:</strong> KES {trip.amount}
      </p>

      {trip.passengerDetails.length > 0 && (
        <>
          <h4>Passenger Contribution</h4>
          <table>
            <thead>
              <tr>
                <th>Passenger Name</th>
                <th>Seat</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {trip.passengerDetails.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.seat}</td>
                  <td>KES {p.paid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default EarningsDetails;