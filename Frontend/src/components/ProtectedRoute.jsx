import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the page
  return children;
};

export default ProtectedRoute;
