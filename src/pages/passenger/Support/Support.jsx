// src/pages/passenger/Support/Support.jsx
import { useState } from "react";
import { FaWhatsapp, FaTwitter, FaEnvelope, FaPhone, FaCopy } from "react-icons/fa";
import "./Support.css";

const PassengerSupport = () => {

  const supportPhone = "+254700123456";
  const supportEmail = "support@pamojaride.com";

  const [tickets, setTickets] = useState([
    { id: 1, subject: "Driver delayed", status: "Closed", date: "2026-03-10" },
    { id: 2, subject: "Payment issue", status: "Open", date: "2026-03-12" },
  ]);

  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I book a trip?",
      answer: "Go to the bookings page, select a trip, choose seats and confirm the booking."
    },
    {
      question: "How do I cancel a booking?",
      answer: "Open your trip history, select the trip and cancel if cancellation is available."
    },
    {
      question: "How do I contact the driver?",
      answer: "After booking, the driver phone number appears in your trip details."
    },
    {
      question: "What payment methods are supported?",
      answer: "PamojaRide supports mobile money and card payments depending on availability."
    }
  ];

  const handleChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const submitTicket = () => {
    if (!newTicket.subject || !newTicket.message) {
      alert("Please fill in all fields.");
      return;
    }

    const ticket = {
      id: tickets.length + 1,
      subject: newTicket.subject,
      message: newTicket.message,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: "", message: "" });
    alert("Support ticket submitted!");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const statusColor = (status) => {
    switch (status) {
      case "Open": return "#f59e0b";
      case "Closed": return "#10b981";
      case "Pending": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  return (
    <div className="passenger-support">

      <h2>Support</h2>

      {/* FAQ SECTION */}
      <div className="faq-section card">
        <h3>Frequently Asked Questions</h3>

        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              {faq.question}
            </div>

            {openFAQ === index && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CONTACT OPTIONS */}
      <div className="contact-options card">
        <h3>Contact Us</h3>

        <div className="contacts">

          <div className="contact-item">
            <a href={`https://wa.me/${supportPhone.replace("+","")}`} target="_blank" rel="noreferrer">
              <FaWhatsapp /> WhatsApp
            </a>
            <button onClick={() => copyToClipboard(supportPhone)}>
              <FaCopy />
            </button>
          </div>

          <div className="contact-item">
            <a href={`tel:${supportPhone}`}>
              <FaPhone /> Call
            </a>
            <button onClick={() => copyToClipboard(supportPhone)}>
              <FaCopy />
            </button>
          </div>

          <div className="contact-item">
            <a href={`mailto:${supportEmail}`}>
              <FaEnvelope /> Email
            </a>
            <button onClick={() => copyToClipboard(supportEmail)}>
              <FaCopy />
            </button>
          </div>

          <a href="https://twitter.com/PamojaRide" target="_blank" rel="noreferrer">
            <FaTwitter /> Twitter
          </a>

        </div>
      </div>

      {/* NEW TICKET */}
      <div className="support-form card">
        <h3>Submit a New Request</h3>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={newTicket.subject}
            onChange={handleChange}
            placeholder="Brief subject"
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            rows="4"
            value={newTicket.message}
            onChange={handleChange}
            placeholder="Describe your issue"
          />
        </div>

        <button className="submit-btn" onClick={submitTicket}>
          Submit
        </button>
      </div>

      {/* TICKETS */}
      <div className="tickets-list">
        <h3>Your Tickets</h3>

        {tickets.length === 0 ? (
          <p>No support tickets yet.</p>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="ticket-card card">
              <div className="ticket-header">
                <strong>{t.subject}</strong>

                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColor(t.status) }}
                >
                  {t.status}
                </span>
              </div>

              <p><strong>Date:</strong> {t.date}</p>
              {t.message && <p><strong>Message:</strong> {t.message}</p>}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default PassengerSupport;