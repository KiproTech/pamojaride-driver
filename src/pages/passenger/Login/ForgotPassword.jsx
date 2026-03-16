import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/images/Pamojaride.png";
import "./Login.css";
import { verifyEmail } from "../../../services/api";

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {

      const res = await verifyEmail(email);

      if (!res?.success) {
        setError(res?.message || "Email not found.");
        return;
      }

      navigate("/reset-password", { state: { email } });

    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="logo-container">
          <img src={logo} alt="PamojaRide Logo" />
          <h2>Verify Email</h2>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleVerify}>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Verify Email"}
          </button>

        </form>

        <p className="login-direct">
          Remember your password? <Link to="../passenger/login">Back to Login</Link>
        </p>

      </div>

    </div>
  );
};

export default ForgotPassword;