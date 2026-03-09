import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/Pamojaride.png";
import "./Landing.css";

const Landing = () => {
  const [role, setRole] = useState("passenger");
  const navigate = useNavigate();

  const handleRoleChange = (e) => setRole(e.target.value);
  const handleLoginClick = () => navigate(`/login?role=${role}`);
  const handleSignupClick = () => navigate(`/signup?role=${role}`);

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <img src={logo} alt="PamojaRide Logo" className="landing-logo" />
        <nav>
          <button onClick={handleLoginClick} className="btn-primary">Login</button>
          <button onClick={handleSignupClick} className="btn-secondary">Sign Up</button>
        </nav>
      </header>

      {/* Hero section */}
      <section className="landing-hero">
        <div className="hero-overlay">
          <h1>Welcome to PamojaRide</h1>
          <p>
            PamojaRide is a smart ride-sharing platform connecting drivers and passengers efficiently and safely.  
            Experience convenience, reliability, and security for all your journeys.
          </p>

          {/* Role selector */}
          <div className="role-selector">
            <label htmlFor="role">I am a:</label>
            <select id="role" value={role} onChange={handleRoleChange}>
              <option value="passenger">Passenger</option>
              <option value="driver">Driver</option>
            </select>
            <button onClick={handleLoginClick} className="btn-primary">Proceed to Login</button>
          </div>
        </div>
      </section>

      {/* Features / Cards */}
      <section className="landing-features">
        <h2>Why Choose PamojaRide?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Book rides quickly with a simple, intuitive interface.</p>
          </div>
          <div className="feature-card">
            <h3>Driver Dashboard</h3>
            <p>Manage trips, earnings, and passenger bookings seamlessly.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Payments</h3>
            <p>All payments are safe, trackable, and cashless if you prefer.</p>
          </div>
          <div className="feature-card">
            <h3>Notifications</h3>
            <p>Receive real-time alerts about trips, bookings, and messages.</p>
          </div>
          <div className="feature-card">
            <h3>Ratings & Reviews</h3>
            <p>Know your driver or passenger ratings to ensure trust and safety.</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>Get help anytime with our dedicated support team.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 PamojaRide. All rights reserved.</p>
        <p>Contact us for more info: <a href="mailto:support@pamojaride.com">support@pamojaride.com</a> | +254 700 000 000</p>
      </footer>
    </div>
  );
};

export default Landing;  
