// components/ProtectedRoute.tsx
import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./AuthSecure";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
