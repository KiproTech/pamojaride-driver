import { useState, useEffect } from "react";
import ActiveBookingsTable from "./ActiveBookingsTable";
import CancelledBookingsTable from "./CancelledBookingsTable";
import DownloadBookingsReport from "./DownloadBookingsReport";
import { apiRequest } from "../../services/api";
import "./bookings.css";

const UpcomingTripCard = ({ trip, onCancelTrip, onBookingCancelled }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeBookings, setActiveBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [seatsAvailable, setSeatsAvailable] = useState(trip.seats_available ?? 0);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const startLocation = trip.start_location;
  const endLocation = trip.end_location;
  const departureDatetime = new Date(trip.departure_datetime).toLocaleString();
  const bookedSeats = activeBookings.length;
  const pricePerSeat = Number(trip.price_per_seat ?? 0);
  const totalRevenue = (bookedSeats * pricePerSeat).toLocaleString();
  const totalSeats = bookedSeats + seatsAvailable;
  const cancelText = bookedSeats > 0 ? "Cancel & Refund" : "Cancel Trip";

  // Lazy load bookings when expanded
  useEffect(() => {
    if (!expanded) return;

    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const activeRes = await apiRequest(`/bookings/${trip.id}/active`);
        const cancelledRes = await apiRequest(`/bookings/${trip.id}/cancelled`);

        setActiveBookings(
          (Array.isArray(activeRes?.data) ? activeRes.data : []).map((b) => ({
            id: b.id,
            passengerName: b.name ?? b.passenger?.name ?? "Unknown",
            seatNumber: b.seat ?? b.seat_number ?? "-",
            phone: b.contact ?? b.phone ?? b.passenger?.phone ?? "-",
            createdAt: b.bookedAt ?? b.created_at ?? null,
            amountPaid: b.amountPaid ?? b.amount_paid ?? b.amount ?? 0,
            status: b.status ?? "active",
            passenger: b.passenger ?? null,
          }))
        );

        setCancelledBookings(
          (Array.isArray(cancelledRes?.data) ? cancelledRes.data : []).map((b) => ({
            id: b.id,
            passengerName: b.name ?? b.passenger?.name ?? "Unknown",
            seatNumber: b.seat ?? b.seat_number ?? "-",
            phone: b.contact ?? b.phone ?? b.passenger?.phone ?? "-",
            cancelledAt: b.cancelled_at ?? null,
            cancelledBy: b.cancelled_by ?? "-",
            refundStatus: b.refund_status ?? "Pending",
            amountPaid: b.amountPaid ?? b.amount_paid ?? b.amount ?? 0,
            status: "cancelled",
            passenger: b.passenger ?? null,
          }))
        );
      } catch (err) {
        console.error("Error fetching bookings for trip:", trip.id, err);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (!activeBookings.length && !cancelledBookings.length) fetchBookings();
  }, [expanded]);

  // Handle a booking cancellation from ActiveBookingsTable
  const handleBookingCancelled = (booking) => {
    setActiveBookings((prev) => prev.filter((b) => b.id !== booking.id));
    setCancelledBookings((prev) => [...prev, booking]);
    setSeatsAvailable((prev) => prev + 1);

    if (onBookingCancelled) onBookingCancelled(booking);
  };

  return (
    <div className="trip-card">
      {/* Trip Summary */}
      <div
        className="trip-card__summary"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="trip-card__route">
          <strong>{startLocation} → {endLocation}</strong>
        </div>
        <div>Departure: {departureDatetime}</div>
        <div>Status: {trip.status}</div>
        <div>Seats: {bookedSeats} / {totalSeats}</div>
        <div>Total Revenue: KES {totalRevenue}</div>
        <div className="trip-card__toggle">{expanded ? "▲" : "▼"}</div>
      </div>

      {/* Cancel Button */}
      {trip.status === "upcoming" && (
        <button
          className="trip-card__cancel"
          onClick={() => onCancelTrip(trip)}
        >
          {cancelText}
        </button>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="trip-card__details">
          {loadingBookings ? (
            <p>Loading bookings...</p>
          ) : (
            <>
              {/* PDF Download */}
              <div className="trip-card__downloads">
                <DownloadBookingsReport
                  trip={{ ...trip, active_bookings: activeBookings, cancelled_bookings: cancelledBookings }}
                />
              </div>

              {/* Active Bookings */}
              <section className="trip-card__bookings">
                <h3>Active Bookings</h3>
                {activeBookings.length > 0 ? (
                  <ActiveBookingsTable
                    tripId={trip.id}
                    initialBookings={activeBookings}
                    onBookingCancelled={handleBookingCancelled}
                  />
                ) : (
                  <p>No active bookings for this trip.</p>
                )}
              </section>

              {/* Cancelled Bookings */}
              <section className="trip-card__bookings">
                <h3>Cancelled Bookings</h3>
                {cancelledBookings.length > 0 ? (
                  <CancelledBookingsTable
                    tripId={trip.id}
                    initialBookings={cancelledBookings}
                  />
                ) : (
                  <p>No cancelled bookings for this trip.</p>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UpcomingTripCard;