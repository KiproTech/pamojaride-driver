import { useEffect, useState } from "react";
import BookingRow from "./BookingRow";
import { fetchActiveBookings } from "../../services/api";

const ActiveBookingsTable = ({
  tripId,
  initialBookings = [],
  readOnly = false,
  onBookingCancelled,
}) => {
  const [bookings, setBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(!initialBookings.length);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialBookings.length) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchActiveBookings(tripId);
        console.log("🔥 Fetched raw bookings:", data);

        const mapped = data.map((b) => ({
          id: b.id,
          passengerName: b.passenger?.name ?? b.passenger_name ?? b.name ?? "Unknown",
          seatNumber: b.seat_number ?? b.seat ?? "-",
          phone: b.passenger?.phone ?? b.phone ?? b.contact ?? "-",
          createdAt: b.booked_at ?? b.created_at ?? null, // ✅ Map booked_at properly
          amountPaid: b.amount_paid ?? b.amount ?? 0,
          status: b.status ?? "active",
          passenger: b.passenger ?? null,
        }));

        console.log("🔥 Mapped bookings for table:", mapped);
        setBookings(mapped);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) fetchBookings();
  }, [tripId, initialBookings]);

  const handleCancel = (updatedBooking) => {
    setBookings((prev) => prev.filter((b) => b.id !== updatedBooking.id));
    if (onBookingCancelled) onBookingCancelled(updatedBooking);
  };

  const handleStatusChange = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
    );
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;
  if (!bookings.length) return <p>No bookings</p>;

  return (
    <table className="active-bookings-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Passenger Name</th>
          <th>Seat Number</th>
          <th>Contact</th>
          <th>Booked At</th>
          <th>Amount Paid (KES)</th>
          <th>Status</th>
          {!readOnly && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking, index) => (
          <BookingRow
            key={booking.id}
            index={index}
            booking={booking}
            onStatusChange={handleStatusChange}
            onCancelled={handleCancel}
            readOnly={readOnly}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ActiveBookingsTable;