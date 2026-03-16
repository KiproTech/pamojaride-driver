import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePassenger } from "../../../context/PassengerContext"; // <-- usePassenger hook
import logo from "../../../assets/images/Pamojaride.png";
import "./Login.css";
import { loginPassenger, setToken } from "../../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { updatePassenger } = usePassenger(); // <-- updated hook usage

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await loginPassenger(cleanEmail, password);

      if (!res?.success) {
        setError(res?.message || "Invalid email or password.");
        return;
      }

      // Save token in localStorage
      setToken(res.token);

      // Store passenger in PassengerContext
      updatePassenger(res.passenger);

      // Navigate to passenger dashboard
      navigate("/passenger/dashboard", { replace: true });

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passenger-login-container">
      <div className="passenger-card">
        <div className="logo-container">
          <img src={logo} alt="PamojaRide Logo" />
          <h2>Passenger Login</h2>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="password-container input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-links">
          <Link to="/passenger/forgot-password">Forgot password?</Link>
          <Link to="/passenger/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;