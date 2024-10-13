import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, requireAuth = true }) => {
  const authToken = localStorage.getItem("auth-token");
  const resultToken = localStorage.getItem("result-token");

  if (requireAuth) {
    // If result-token exists, allow access to result routes
    if (resultToken) return children;

    // If auth-token exists, allow access to other protected routes
    return authToken ? children : <Navigate to="/login" replace />;
  }

  // If no authentication required, show the page
  return children;
};

export default PublicRoute;
