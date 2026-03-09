import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/images/Pamojaride.png"; // your logo path

const DownloadTripReport = ({ trip }) => {
  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");
  const formatAmount = (amount) => Number(amount ?? 0).toLocaleString("en-KE");

  const handleDownload = () => {
    if (!trip) return alert("Trip data missing");

    const mappedPassengers = trip.passengers?.map((p) => ({
      name: p.name,
      seat: p.seat,
      contact: p.contact,
      bookedAt: p.bookedAt,
      cancelledAt: p.cancelledAt,
      amountPaid: p.amountPaid,
      status: p.status,
    })) || [];

    const doc = new jsPDF("p", "pt");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Logo
    doc.addImage(logo, "PNG", 40, 20, 50, 50);

    // Title
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129);
    doc.text("PamojaRide Trip Report", pageWidth / 2, 45, { align: "center" });

    // Trip Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Trip: ${trip.route.replace("→"," - ")}`, 40, 85);
    doc.text(`Departure: ${formatDate(trip.departure)}`, 40, 100);
    doc.text(`Archived At: ${formatDate(trip.archivedAt)}`, 40, 115);
    doc.text(`Total Collected: KES ${formatAmount(trip.totalCollected)}`, 40, 130);

    let y = 150;

    // Table of passengers
    if (mappedPassengers.length) {
      autoTable(doc, {
        startY: y,
        head: [["#", "Passenger", "Seat", "Contact", "Booked At", "Cancelled At", "Amount (KES)", "Status"]],
        body: mappedPassengers.map((p, i) => [
          i + 1,
          p.name,
          p.seat,
          p.contact,
          formatDate(p.bookedAt),
          formatDate(p.cancelledAt),
          formatAmount(p.amountPaid),
          p.status,
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        margin: { left: 40, right: 40 },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 7 && data.cell.raw === "Cancelled") {
            data.cell.styles.fillColor = [254, 202, 202];
            data.cell.styles.textColor = [185, 28, 28];
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
    doc.text("Phone: +254 7XXXXXXXX", 40, y + 28);

    doc.save(`Trip_${trip.id ?? "Unknown"}_Report.pdf`);
  };

  return (
    <button onClick={handleDownload} className="download-btn">
      Download PDF
    </button>
  );
};

export default DownloadTripReport;