import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/images/Pamojaride.png";
import "./Login.css";
import { registerUser } from "../../services/api";

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    const newErrors = {};
    if (fullName.trim().split(" ").length < 2) newErrors.fullName = "Full name must contain at least two words.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address.";
    const phoneRegex = /^\d{10,12}$/;
    if (!phoneRegex.test(phone)) newErrors.phone = "Phone number must be 10 to 12 digits.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validateInput()) return;

    setLoading(true);
    try {
      const data = await registerUser(fullName, email, password, phone);

      if (!data?.success) {
        setErrors({ general: data?.message || "Signup failed." });
        return;
      }

      setSuccess("Registration successful! Redirecting...");
      if (onSignup) onSignup(data.user);

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setErrors({ general: err?.message || "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="PamojaRide Logo" />
          <h2>Sign Up</h2>
        </div>

        {errors.general && <p className="error">{errors.general}</p>}
        {success && <p className="success">{success}</p>}

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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="login-direct">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;