import { useEffect, useState } from "react";
import RatingsSummary from "./RatingsSummary";
import RatingsList from "./RatingsListComponent";
import "./ratings.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

const fetchWithToken = async (endpoint, options = {}) => {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
};

const Ratings = () => {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const [summaryRes, listRes] = await Promise.all([
          fetchWithToken("/trips/ratings/summary"),
          fetchWithToken("/trips/ratings/list"),
        ]);

        if (summaryRes.success) setSummary(summaryRes.data);
        if (listRes.success) setReviews(listRes.data);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) return <p>Loading ratings...</p>;
  if (error) return <p>Error: {error}</p>;

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