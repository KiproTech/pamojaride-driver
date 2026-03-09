import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/images/Pamojaride.png";

const DownloadBookingsReport = ({ trip, format = "PDF" }) => {
  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");
  const formatAmount = (amount) =>
    Number(amount ?? 0).toLocaleString("en-KE");

  const handleDownload = () => {
    try {
      if (!trip) throw new Error("Trip data missing");

      const activeBookings = Array.isArray(trip.active_bookings)
        ? trip.active_bookings
        : [];
      const cancelledBookings = Array.isArray(trip.cancelled_bookings)
        ? trip.cancelled_bookings
        : [];

      if (!activeBookings.length && !cancelledBookings.length) {
        alert(
          "No bookings data available to generate report. Expand the trip to load bookings first."
        );
        return;
      }

      // Normalize bookings
      const mapBooking = (b, type = "active") => ({
        id: b.id ?? "N/A",
        passengerName: b.passenger?.name ?? b.passengerName ?? b.name ?? "Unknown",
        seatNumber: b.seat_number ?? b.seat ?? "-",          // seat_number first
        phone: b.passenger?.phone ?? b.phone ?? "-",
        createdAt: b.booked_at ?? b.createdAt ?? null,       // booked_at first
        cancelledAt: b.cancelled_at ?? b.cancelledAt ?? null,
        cancelledBy: b.cancelled_by ?? b.cancelledBy ?? "-",
        amountPaid: b.amount_paid ?? b.amountPaid ?? b.amount ?? 0,
        status: b.status ?? type,
      });

      const mappedActive = activeBookings.map((b) => mapBooking(b, "active"));
      const mappedCancelled = cancelledBookings.map((b) => mapBooking(b, "cancelled"));

      const doc = new jsPDF("p", "pt");
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.addImage(logo, "PNG", 40, 20, 50, 50);
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text(
        "PamojaRide Trip Bookings Report",
        pageWidth / 2,
        45,
        { align: "center" }
      );

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(
        `Trip: ${trip.start_location ?? "-"} → ${trip.end_location ?? "-"}`,
        40,
        85
      );
      doc.text(`Departure: ${formatDate(trip.departure_datetime)}`, 40, 100);
      doc.text(`Trip ID: ${trip.id ?? "-"}`, 40, 115);
      doc.text(`Generated: ${formatDate(new Date())}`, 40, 130);

      let y = 160;

      // Active Bookings Table
      if (mappedActive.length) {
        doc.setFontSize(14);
        doc.setTextColor(16, 185, 129);
        doc.text("Active Bookings", 40, y);
        y += 10;

        autoTable(doc, {
          startY: y,
          head: [["#", "Passenger", "Seat", "Contact", "Booked At", "Amount (KES)"]],
          body: mappedActive.map((b, i) => [
            i + 1,
            b.passengerName,
            b.seatNumber,
            b.phone,
            formatDate(b.createdAt),
            formatAmount(b.amountPaid),
          ]),
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [16, 185, 129], textColor: 255 },
          margin: { left: 40, right: 40 },
        });

        y = doc.lastAutoTable.finalY + 20;
      }

      // Cancelled Bookings Table
      if (mappedCancelled.length) {
        doc.setFontSize(14);
        doc.setTextColor(239, 68, 68);
        doc.text("Cancelled Bookings", 40, y);
        y += 10;

        autoTable(doc, {
          startY: y,
          head: [["#", "Passenger", "Seat", "Cancelled At", "Cancelled By", "Amount (KES)"]],
          body: mappedCancelled.map((b, i) => [
            i + 1,
            b.passengerName,
            b.seatNumber,
            formatDate(b.cancelledAt),
            b.cancelledBy,
            formatAmount(b.amountPaid),
          ]),
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [239, 68, 68], textColor: 255 },
          margin: { left: 40, right: 40 },
          didParseCell: (data) => {
            if (data.section === "body" && data.column.index === 5) {
              data.cell.styles.textColor = 255;
              data.cell.styles.fillColor = [254, 202, 202];
            }
          },
        });

        y = doc.lastAutoTable.finalY + 20;
      }

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text("PamojaRide Support", 40, y);
      doc.text("Email: support@pamojaride.com", 40, y + 14);
      doc.text("Phone: +254 729326900", 40, y + 28);

      doc.save(`Trip_${trip.id ?? "Unknown"}_Bookings_Report.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(
        err.message ||
          "Failed to generate report. Make sure the trip is expanded to load bookings."
      );
    }
  };

  return (
    <button
      className="download-btn"
      onClick={handleDownload}
      disabled={!Array.isArray(trip?.active_bookings) && !Array.isArray(trip?.cancelled_bookings)}
    >
      Download {format}
    </button>
  );
};

export default DownloadBookingsReport;