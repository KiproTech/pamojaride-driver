import { useEffect, useState } from "react";
import axios from "axios";
import "./ratings.css"; // Ensure this is imported for styling

const RatingsSummary = () => {
  const [data, setData] = useState({
    average: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/trips/ratings/summary",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError("Failed to load ratings summary");
        }
      } catch (err) {
        console.error("Error fetching ratings summary:", err);
        setError("Failed to load ratings summary");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) return <p className="ratings-loading">Loading ratings summary...</p>;
  if (error) return <p className="ratings-error">{error}</p>;

  return (
    <div className="ratings-summary">
      <div className="summary-card average-rating">
        <h3>Average Rating</h3>
        <p className="stars">⭐ {data.average}</p>
      </div>
      <div className="summary-card total-reviews">
        <h3>Total Reviews</h3>
        <p>{data.totalReviews}</p>
      </div>
      <div className="summary-card rating-breakdown">
        <h3>Rating Breakdown</h3>
        {Object.entries(data.breakdown)
          .sort((a, b) => b[0] - a[0])
          .map(([stars, count]) => (
            <p key={stars} className="breakdown-item">
              <span className="stars">{stars} ⭐</span>: {count}
            </p>
          ))}
      </div>
    </div>
  );
};

export default RatingsSummary;