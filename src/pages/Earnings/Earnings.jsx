import { useEffect, useState } from "react";
import axios from "axios";
import EarningsSummaryCards from "./EarningsSummaryCards";
import EarningsTable from "./EarningsTable";
import EarningsDetails from "./EarningsDetails";
import EarningsChart from "./EarningsChart";
import DownloadEarningsReport from "./DownloadEarningsReport";
import "./earnings.css";

const Earnings = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewTrip = (trip) => setSelectedTrip(trip);
  const handleCloseDetails = () => setSelectedTrip(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/earnings",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"), // or your auth token
            },
          }
        );

        if (response.data.success) {
          // Clean up date formatting
          const formattedTrips = response.data.trips.map((trip) => ({
            ...trip,
            date: new Date(trip.date).toLocaleString(),
          }));
          setTrips(formattedTrips);
        } else {
          setError("Failed to fetch earnings");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching earnings");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <p>Loading earnings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="earnings-page">
      <h2>Earnings Dashboard</h2>

      <EarningsSummaryCards trips={trips} />

      <DownloadEarningsReport trips={trips} />

      <EarningsChart trips={trips} />

      <EarningsTable trips={trips} onView={handleViewTrip} />

      <EarningsDetails trip={selectedTrip} onClose={handleCloseDetails} />
    </div>
  );
};

export default Earnings;