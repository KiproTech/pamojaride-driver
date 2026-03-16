import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/Pamojaride.png";
import "./Landing.css";

const Landing = () => {
  const [role, setRole] = useState("passenger");
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const navigate = useNavigate();

  const loginRef = useRef();
  const signupRef = useRef();

  const handleSelectRole = (selectedRole, type) => {
    setRole(selectedRole);
    if (type === "login") {
      navigate(selectedRole === "driver" ? "/login" : "/passenger/login");
    } else if (type === "signup") {
      navigate(selectedRole === "driver" ? "/signup" : "/passenger/signup");
    }
    setShowLoginOptions(false);
    setShowSignupOptions(false);
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target))
        setShowLoginOptions(false);
      if (signupRef.current && !signupRef.current.contains(event.target))
        setShowSignupOptions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <img src={logo} alt="PamojaRide Logo" className="landing-logo" />
        <nav>
          <div className="dropdown" ref={loginRef}>
            <button
              className="btn-primary"
              onClick={() => setShowLoginOptions(!showLoginOptions)}
            >
              Login
            </button>
            {showLoginOptions && (
              <div className="dropdown-menu">
                <button onClick={() => handleSelectRole("passenger", "login")}>
                  As Passenger
                </button>
                <button onClick={() => handleSelectRole("driver", "login")}>
                  As Driver
                </button>
              </div>
            )}
          </div>

          <div className="dropdown" ref={signupRef}>
            <button
              className="btn-secondary"
              onClick={() => setShowSignupOptions(!showSignupOptions)}
            >
              Sign Up
            </button>
            {showSignupOptions && (
              <div className="dropdown-menu">
                <button onClick={() => handleSelectRole("passenger", "signup")}>
                  As Passenger
                </button>
                <button onClick={() => handleSelectRole("driver", "signup")}>
                  As Driver
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <section className="landing-hero">
        <div className="hero-overlay">
          <h1>Welcome to <span>PamojaRide</span></h1>
          <p>
            PamojaRide is your trusted ride-sharing platform connecting passengers and drivers seamlessly.
          </p>

          {/* Role Selection Cards */}
          <div className="role-cards">
            <div
              className={`role-card ${role === "passenger" ? "selected" : ""}`}
              onClick={() => handleSelectRole("passenger", "login")}
            >
              <h3>Passenger</h3>
              <p>Book rides easily, track your driver in real-time, and enjoy safe travel experiences.</p>
            </div>

            <div
              className={`role-card ${role === "driver" ? "selected" : ""}`}
              onClick={() => handleSelectRole("driver", "login")}
            >
              <h3>Driver</h3>
              <p>Manage trips efficiently, accept bookings, track earnings, and provide excellent service.</p>
            </div>
          </div>

          {/* Hero signup button */}
          <div className="dropdown hero-btn-dropdown">
            <button
              className="btn-primary hero-btn"
              onClick={() => setShowSignupOptions(!showSignupOptions)}
            >
              Create Your Account
            </button>
            {showSignupOptions && (
              <div className="dropdown-menu">
                <button onClick={() => handleSelectRole("passenger", "signup")}>
                  As Passenger
                </button>
                <button onClick={() => handleSelectRole("driver", "signup")}>
                  As Driver
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="landing-features">
        <h2>Why Choose <span>PamojaRide</span>?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Book rides in seconds with a simple and intuitive interface.</p>
          </div>
          <div className="feature-card">
            <h3>Driver Dashboard</h3>
            <p>Track trips, earnings, and manage passengers efficiently.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Payments</h3>
            <p>All transactions are fully secure and transparent.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Tracking</h3>
            <p>Passengers can track drivers live, and drivers navigate efficiently.</p>
          </div>
          <div className="feature-card">
            <h3>Ratings & Reviews</h3>
            <p>Trust with a robust rating system for both passengers and drivers.</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>Our dedicated support team is always available to help.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div>
          <p>&copy; 2026 PamojaRide. All rights reserved.</p>
          <p>
            Contact us: <a href="mailto:support@pamojaride.com">support@pamojaride.com</a> | +254 700 000 000
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
