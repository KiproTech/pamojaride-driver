import React, { useState, useEffect } from "react";
import { bookTrip } from "../../../services/api.js";
import jsPDF from "jspdf";
import logo from "../../../assets/images/Pamojaride.png";
import "./Bookings.css";

const TripCard = ({ trip }) => {
  const [ticket, setTicket] = useState(null);

  // Load ticket from localStorage on mount
  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
    const savedTicket = storedTickets.find((t) => t.booking_id === trip.id);
    if (savedTicket) setTicket(savedTicket);
  }, [trip.id]);

  const handleBookTrip = async () => {
    try {
      const res = await bookTrip({
        trip_id: trip.id,
        seat_count: 1,
        payment_method: "mpesa",
      });

      alert(res.message);

      if (res.booking) {
        const newTicket = {
          ...res.booking,
          from: trip.start_location,
          to: trip.end_location,
          departure_datetime: trip.departure_datetime,
          driver_name: trip.driver_name,
          driver_phone: trip.driver_phone,
          amount: trip.price_per_seat,
          seats_booked: [1],
          booking_id: res.booking.booking_id,
        };

        setTicket(newTicket);

        // Save ticket to localStorage
        const storedTickets = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
        localStorage.setItem("bookedTickets", JSON.stringify([...storedTickets, newTicket]));
      }
    } catch (err) {
      console.error("Booking failed:", err.message);
    }
  };

  const downloadPDF = (t) => {
    if (!t) return;
    const formattedDate = new Date(t.departure_datetime).toLocaleDateString();
    const formattedTime = new Date(t.departure_datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const seats = t.seats_booked?.join(", ") || "N/A";

    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      doc.addImage(img, "PNG", 150, 10, 40, 20);
      doc.setFontSize(18);
      doc.text("PamojaRide", 20, 20);
      doc.setFontSize(10);
      doc.text("Boarding Pass", 20, 26);
      doc.line(20, 30, 190, 30);
      doc.setFontSize(20);
      doc.text(t.from, 20, 45);
      doc.text("→", 100, 45);
      doc.text(t.to, 120, 45);
      doc.roundedRect(20, 55, 170, 80, 5, 5);
      doc.setFontSize(11);
      doc.text("Passenger", 25, 70);
      doc.text("User", 25, 76);
      doc.text("Date", 25, 88);
      doc.text(formattedDate, 25, 94);
      doc.text("Seats", 25, 106);
      doc.text(seats, 25, 112);
      doc.text("Time", 120, 70);
      doc.text(formattedTime, 120, 76);
      doc.text("Amount", 120, 88);
      doc.text(`Ksh ${t.amount}`, 120, 94);
      doc.text("Driver", 120, 106);
      doc.text(t.driver_name, 120, 112);
      doc.line(20, 140, 190, 140);
      doc.setFontSize(10);
      doc.text(`Ticket No: PR-${t.booking_id}`, 20, 148);
      doc.setFontSize(9);
      doc.text("Support: support@pamojaride.com | +254 729326900", 20, 160);
      doc.save(`BoardingPass_${t.booking_id}.pdf`);
    };
  };

  const navigateToMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${trip.start_location}&destination=${trip.end_location}`;
    window.open(url, "_blank");
  };

  return (
    <div className="trip-card">
      <div className="trip-header">
        <h3>{trip.start_location} → {trip.end_location}</h3>
        <span>Seats Left: {trip.seats_available}</span>
      </div>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(trip.departure_datetime).toLocaleDateString()} at{" "}
        {new Date(trip.departure_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
      <p><strong>Amount:</strong> Ksh {trip.price_per_seat}</p>
      <p><strong>Driver:</strong> {trip.driver_name} ({trip.driver_phone})</p>
      <div className="trip-actions">
        <button onClick={handleBookTrip}>Book Trip</button>
        <button onClick={navigateToMap}>View on Map</button>
        {/* Persistent download button */}
        {ticket && (
          <button onClick={() => downloadPDF(ticket)}>
            Download Boarding Pass
          </button>
        )}
      </div>
    </div>
  );
};

export default TripCard;