import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/Pamojaride.png";
import "./Login.css";
import { resetPassword } from "../../../services/api";

const ResetPassword = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {

      const res = await resetPassword(email, password);

      if (!res?.success) {
        setError(res.message || "Reset failed.");
        return;
      }

      setSuccess("Password updated successfully!");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="logo-container">
          <img src={logo} alt="PamojaRide Logo" />
          <h2>Reset Password</h2>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleReset}>

          <div className="input-group">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
            />
          </div>

          <button type="submit">
            Reset Password
          </button>

        </form>

      </div>

    </div>
  );
};

export default ResetPassword;