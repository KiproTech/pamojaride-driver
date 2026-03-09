import { useEffect, useState } from "react";
import { fetchCancelledBookings } from "../../services/api";

const CancelledBookingsTable = ({ tripId, initialBookings = [], newCancelledBooking }) => {
  const [cancelledBookings, setCancelledBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(!initialBookings.length);
  const [error, setError] = useState("");

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");
  const formatAmount = (amount) => Number(amount ?? 0).toLocaleString("en-KE");

  useEffect(() => {
    const fetchCancelled = async () => {
      if (initialBookings.length) return;

      setLoading(true);
      setError("");

      try {
        const res = await fetchCancelledBookings(tripId);
        const bookings = Array.isArray(res?.data)
          ? res.data.map((b) => ({
              id: b.id,
              passengerName: b.name ?? b.passenger_name ?? b.passenger?.name ?? "Unknown",
              seatNumber: b.seat ?? b.seat_number ?? "-",
              phone: b.contact ?? b.phone ?? b.passenger?.phone ?? "-",
              cancelledAt: b.cancelled_at ?? null,
              cancelledBy: b.cancelled_by ?? "Passenger/Driver",
              refundStatus: b.refund_status ?? "Pending",
              amountPaid: b.amountPaid ?? b.amount_paid ?? b.amount ?? 0,
              status: "cancelled",
            }))
          : [];

        // Sort by cancelledAt descending
        bookings.sort((a, b) => new Date(b.cancelledAt) - new Date(a.cancelledAt));

        setCancelledBookings(bookings);
      } catch (err) {
        console.error("Error fetching cancelled bookings:", err);
        setError("Failed to load cancelled bookings.");
        setCancelledBookings([]);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) fetchCancelled();
  }, [tripId, initialBookings]);

  useEffect(() => {
    if (newCancelledBooking) {
      setCancelledBookings((prev) => [newCancelledBooking, ...prev]);
    }
  }, [newCancelledBooking]);

  if (loading) return <div>Loading cancelled bookings...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cancelledBookings.length) return <div>No cancelled bookings</div>;

  return (
    <table className="cancelled-bookings-table">
      <thead>
        <tr>
          <th>Passenger Name</th>
          <th>Seat Number</th>
          <th>Contact</th>
          <th>Cancelled At</th>
          <th>Cancelled By</th>
          <th>Refund Status</th>
          <th>Amount (KES)</th>
        </tr>
      </thead>
      <tbody>
        {cancelledBookings.map((b) => (
          <tr key={b.id}>
            <td>{b.passengerName}</td>
            <td>{b.seatNumber}</td>
            <td>{b.phone}</td>
            <td>{formatDate(b.cancelledAt)}</td>
            <td>{b.cancelledBy}</td>
            <td>
              <span className={`refund-status ${b.refundStatus.toLowerCase()}`}>
                {b.refundStatus}
              </span>
            </td>
            <td>{formatAmount(b.amountPaid)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CancelledBookingsTable;