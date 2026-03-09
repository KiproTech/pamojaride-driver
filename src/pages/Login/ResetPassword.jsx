// src/pages/Login/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/images/Pamojaride.png";
import "./Login.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const validateInput = () => {
    if (newPassword.trim().length < 6) {
      setMessage("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!validateInput()) return;

    try {
      const res = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="PamojaRide Logo" className="logo" />
          <h2>Reset Password</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {message && <p className={success ? "success" : "error"}>{message}</p>}

          <div className="password-container input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Reset Password</button>

          <p className="redirect-link">
            Remembered your password? <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;