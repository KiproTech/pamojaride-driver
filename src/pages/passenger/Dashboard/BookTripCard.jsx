import React, { useState } from "react";
import "./dashboard.css";

const BookTripCard = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      `Trip booked: ${form.from} → ${form.to} on ${form.date} at ${form.time}`
    );
  };

  return (
    <div className="book-trip-card">
      <h3>Book a New Trip</h3>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>From</label>
          <input
            type="text"
            name="from"
            value={form.from}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>To</label>
          <input
            type="text"
            name="to"
            value={form.to}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Seats</label>
          <input
            type="number"
            name="seats"
            value={form.seats}
            onChange={handleChange}
            min="1"
            max="10"
            required
          />
        </div>

        <button type="submit">Book Trip</button>

      </form>
    </div>
  );
};

export default BookTripCard;