const PassengerListTable = ({ passengers }) => {
  if (!passengers || passengers.length === 0) {
    return <p>No passengers for this trip.</p>;
  }

  return (
    <table className="trip-passenger-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Seat</th>
          <th>Contact</th>
          <th>Booking Date & Time</th>
          <th>Cancelled At</th>
          <th>Amount Paid</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {passengers.map(p => (
          <tr key={p.id} className={p.status === "Cancelled" ? "cancelled-passenger" : ""}>
            <td>{p.name}</td>
            <td>{p.seat}</td>
            <td>{p.contact}</td>
            <td>{p.bookedAt}</td>
            <td>{p.cancelledAt || "-"}</td>
            <td>${p.amountPaid}</td>
            <td>{p.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PassengerListTable;