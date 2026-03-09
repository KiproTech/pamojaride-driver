const EarningsTable = ({ trips, onView }) => {
  return (
    <div className="earnings-table">
      <h3>Completed Trips</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Route</th>
            <th>Passengers</th>
            <th>Amount Collected</th>
            <th>Payment Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.date}</td>
              <td>
                {trip.start} → {trip.destination}
              </td>
              <td>{trip.passengers}</td>
              <td>KES {trip.amount}</td>
              <td>{trip.paymentStatus}</td>
              <td>
                <button onClick={() => onView(trip)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EarningsTable;