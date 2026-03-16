import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // Get token and role from localStorage
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If no token, redirect to the appropriate login page
  if (!token) {
    return role === "passenger" 
      ? <Navigate to="/passenger/login" replace /> 
      : <Navigate to="/login" replace />;
  }

  // If role is specified and doesn't match the user's role
  if (role && role !== userRole) {
    return role === "passenger"
      ? <Navigate to="/passenger/login" replace />
      : <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected content
  return children;
}
