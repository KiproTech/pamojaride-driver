import { useState, useEffect } from "react";
import RatingItem from "./RatingItem";
import "./ratings.css"; // import your CSS

const RatingsListComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/trips/ratings/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setReviews(data.data);
        } else {
          setError("Failed to load ratings list");
        }
      } catch (err) {
        console.error("Failed to fetch ratings list:", err);
        setError("Failed to load ratings list");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p className="ratings-loading">Loading reviews...</p>;
  if (error) return <p className="ratings-error">{error}</p>;

  return (
    <div className="ratings-list">
      {reviews.map((review) => (
        <RatingItem key={review.id} rating={review} />
      ))}
    </div>
  );
};

export default RatingsListComponent;