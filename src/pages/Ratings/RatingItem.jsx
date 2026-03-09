const RatingItem = ({ rating }) => {
  const fullStars = "★".repeat(rating.stars);
  const emptyStars = "☆".repeat(5 - rating.stars);

  return (
    <div className="rating-item">
      <div className="rating-header">
        <strong>{rating.passenger}</strong> - <span className="stars">{fullStars}{emptyStars}</span>
      </div>
      <p>{rating.comment}</p>
    </div>
  );
};

export default RatingItem;