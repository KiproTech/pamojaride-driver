import { useState } from "react";
import { validateLocation } from "../../utils/validateLocation";

const TripForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    start_location: "",
    end_location: "",
    departure_datetime: "",
    seats_available: "",
    price_per_seat: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || submitting) return;

    setSubmitting(true);

    try {
      // -----------------------------
      // Convert datetime-local to MySQL local format
      // -----------------------------
      const tripDate = new Date(form.departure_datetime);
      const formattedDatetime =
        tripDate.getFullYear() + "-" +
        String(tripDate.getMonth() + 1).padStart(2, "0") + "-" +
        String(tripDate.getDate()).padStart(2, "0") + " " +
        String(tripDate.getHours()).padStart(2, "0") + ":" +
        String(tripDate.getMinutes()).padStart(2, "0") + ":" +
        String(tripDate.getSeconds()).padStart(2, "0");

      const trimmedForm = {
        start_location: form.start_location.trim(),
        end_location: form.end_location.trim(),
        departure_datetime: formattedDatetime, // local datetime
        seats_available: Number(form.seats_available),
        price_per_seat: Number(form.price_per_seat)
      };

      // -----------------------------
      // Validation
      // -----------------------------
      if (
        trimmedForm.start_location.toLowerCase() ===
        trimmedForm.end_location.toLowerCase()
      ) {
        alert("Start and destination cannot be the same.");
        return;
      }

      if (trimmedForm.seats_available <= 0 || trimmedForm.price_per_seat < 0) {
        alert("Seats and price must be valid numbers.");
        return;
      }

      const now = new Date();
      if (tripDate <= now) {
        alert("Please select a future date and time.");
        return;
      }

      // Validate locations asynchronously
      const [startValid, destValid] = await Promise.all([
        validateLocation(trimmedForm.start_location),
        validateLocation(trimmedForm.end_location)
      ]);

      if (!startValid || !destValid) {
        alert("One or both locations are invalid.");
        return;
      }

      // -----------------------------
      // Submit to parent
      // -----------------------------
      await onSubmit(trimmedForm);

      // Reset form after successful submit
      setForm({
        start_location: "",
        end_location: "",
        departure_datetime: "",
        seats_available: "",
        price_per_seat: ""
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="start_location"
        placeholder="Start location"
        value={form.start_location}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="end_location"
        placeholder="Destination"
        value={form.end_location}
        onChange={handleChange}
        required
      />

      <input
        type="datetime-local"
        name="departure_datetime"
        value={form.departure_datetime}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="seats_available"
        placeholder="Seats available"
        min="1"
        value={form.seats_available}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price_per_seat"
        placeholder="Price per seat (KES)"
        min="0"
        value={form.price_per_seat}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading || submitting}>
        {loading || submitting ? "Creating trip..." : "Create Trip"}
      </button>
    </form>
  );
};

export default TripForm;