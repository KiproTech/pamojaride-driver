import { useEffect, useState } from "react";
import RatingsSummary from "./RatingsSummary";
import RatingsList from "./RatingsListComponent";
import "./ratings.css";

const Ratings = () => {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem("token"); // or however you store JWT
        const [summaryRes, listRes] = await Promise.all([
          fetch("http://localhost:5000/api/trips/ratings/summary", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/trips/ratings/list", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const summaryData = await summaryRes.json();
        const listData = await listRes.json();

        if (summaryData.success) setSummary(summaryData.data);
        if (listData.success) setReviews(listData.data);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) return <p>Loading ratings...</p>;

  return (
    <div className="ratings-page">
      <h2>Driver Ratings</h2>
      {summary && <RatingsSummary data={summary} />}
      {reviews.length > 0 && <RatingsList reviews={reviews} />}
      {!summary && reviews.length === 0 && <p>No ratings yet.</p>}
    </div>
  );
};

export default Ratings;