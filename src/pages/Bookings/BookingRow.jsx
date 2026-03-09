import { apiRequest } from "../../services/api";

const BookingRow = ({ booking, index, onStatusChange, onCancelled, readOnly = false }) => {
  const {
    id,
    passengerName,
    seatNumber,
    phone,
    createdAt,
    amountPaid,
    status,
    passenger,
  } = booking;

  const formatAmount = (amount) => Number(amount ?? 0).toLocaleString("en-KE");
  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

  const handleCancelRefund = async () => {
    if (!window.confirm(`Cancel booking for ${passengerName || passenger?.name}?`)) return;

    try {
      const res = await apiRequest(`/bookings/${id}/cancel`, {
        method: "PUT",
        body: JSON.stringify({ action: "refund" }),
      });

      if (!res?.success) throw new Error(res?.message || "Cancel failed");

      const data = res.data ?? {};

      const updatedBooking = {
        ...booking,
        status: "cancelled",
        cancelledAt: data.cancelled_at ?? new Date().toISOString(),
        cancelledBy: data.cancelled_by ?? "Admin",
      };

      if (onStatusChange) onStatusChange(updatedBooking);
      if (onCancelled) onCancelled(updatedBooking);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert(err.message || "Failed to cancel booking. Please try again.");
    }
  };

  const renderAction = () => {
    if (readOnly) return null;

    switch (status.toLowerCase()) {
      case "active":
        return (
          <button className="danger cancel-btn" onClick={handleCancelRefund}>
            Cancel & Refund
          </button>
        );
      case "completed":
        return <span className="status completed">Completed</span>;
      case "cancelled":
        return <span className="status cancelled">Cancelled</span>;
      default:
        return <span className="status pending">{status || "Pending"}</span>;
    }
  };

  console.log(`Row ${index + 1} data:`, booking); // 🔥 debug

  return (
    <tr className={`booking-row ${status?.toLowerCase()}`}>
      <td>{index + 1}</td>
      <td>{passengerName || passenger?.name || "Unknown"}</td>
      <td>{seatNumber ?? "-"}</td>
      <td>{phone ?? passenger?.phone ?? "-"}</td>
      <td>{formatDate(createdAt)}</td>
      <td>{formatAmount(amountPaid)}</td>
      <td>
        <span className={`status ${status?.toLowerCase().replace(/\s/g, "-") || "pending"}`}>
          {status || "Pending"}
        </span>
      </td>
      {!readOnly && <td>{renderAction()}</td>}
    </tr>
  );
};

export default BookingRow;