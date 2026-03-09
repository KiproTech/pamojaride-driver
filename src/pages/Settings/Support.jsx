import "./settings.css";

export default function Support() {
  // Mock contact info
  const contact = {
    phone: "+254701234567",
    whatsapp: "+254701234567",
    email: "support@pamojaride.com",
    facebook: "https://facebook.com/pamojaride",
    twitter: "https://twitter.com/pamojaride",
  };

  return (
    <div className="settings-page">
      <h2>Support & Contact</h2>
      <p>If you need help, contact our support team via any of the options below:</p>

      <ul className="support-list">
        <li>
          📞 Phone:{" "}
          <a href={`tel:${contact.phone}`} className="support-link">
            {contact.phone}
          </a>
        </li>
        <li>
          💬 WhatsApp:{" "}
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="support-link"
          >
            Chat on WhatsApp
          </a>
        </li>
        <li>
          📧 Email:{" "}
          <a href={`mailto:${contact.email}`} className="support-link">
            {contact.email}
          </a>
        </li>
        <li>
          📘 Facebook:{" "}
          <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="support-link">
            Visit Page
          </a>
        </li>
        <li>
          🐦 Twitter:{" "}
          <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="support-link">
            Visit Page
          </a>
        </li>
      </ul>
    </div>
  );
}
