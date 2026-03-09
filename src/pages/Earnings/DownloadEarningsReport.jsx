const DownloadEarningsReport = ({ trips }) => {

  const downloadCSV = () => {
    if (!trips || trips.length === 0) {
      alert("No data available to download");
      return;
    }

    const headers = [
      "Date",
      "Start Location",
      "Destination",
      "Passengers",
      "Amount Collected",
      "Payment Status"
    ];

    const rows = trips.map(trip => [
      trip.date,
      trip.start,
      trip.destination,
      trip.passengers,
      trip.amount,
      trip.paymentStatus
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "earnings_report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="download-report">
      <button onClick={downloadCSV}>
        Download Earnings Report
      </button>
    </div>
  );
};

export default DownloadEarningsReport;