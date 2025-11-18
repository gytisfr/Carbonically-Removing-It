import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If logged in, redirect to home
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default PublicRoute;
