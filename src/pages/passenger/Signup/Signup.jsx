// src/pages/passenger/Signup/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePassenger } from "../../../context/PassengerContext"; // <- correct context
import logo from "../../../assets/images/Pamojaride.png";
import "../Login/Login.css";
import { registerPassenger, setToken } from "../../../services/api";

const Signup = () => {
  const navigate = useNavigate();
  const { updatePassenger } = usePassenger(); // <- usePassenger hook

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    const newErrors = {};
    if (fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Full name must contain at least two names.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Enter a valid email address.";
    const phoneRegex = /^\d{10,12}$/;
    if (!phoneRegex.test(phone)) newErrors.phone = "Phone number must be 10-12 digits.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!validateInput()) {
      setLoading(false);
      return;
    }

    try {
      const res = await registerPassenger(fullName, email, password, phone);

      if (!res?.success) {
        setErrors({ general: res?.message || "Signup failed." });
        setLoading(false);
        return;
      }

      // Save token and passenger data
      setToken(res.token);
      updatePassenger(res.passenger);

      navigate("/passenger/dashboard", { replace: true });
    } catch (err) {
      setErrors({ general: err.message || "Signup failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passenger-login-container">
      <div className="login-card passenger-card">
        <div className="logo-container">
          <img src={logo} alt="PamojaRide Logo" />
          <h2>Passenger Sign Up</h2>
        </div>

        {errors.general && <p className="error">{errors.general}</p>}

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <p className="input-error">{errors.fullName}</p>}
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="input-error">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <p className="input-error">{errors.phone}</p>}
          </div>

          <div className="password-container input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="login-links">
          <span>Already have an account?</span>
          <Link to="/passenger/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;