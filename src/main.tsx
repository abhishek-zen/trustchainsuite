import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import MyConsentsPage from "./pages/my-consents"; // if routing there
import "./index.css";

import ApplicationManager from "./components/core/ApplicationManager";
import ApplicationDashboard from "./components/core/ApplicationDashboard";
import RegisterApplication from "./components/core/RegisterApplication";
import MyConsents from "./components/MyConsents";
import Login from "./pages/Login";

import ProtectedRoute from "./components/auth/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
        <Route
          path="/my-consents"
          element={
            <ProtectedRoute>
              <MyConsents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ApplicationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <RegisterApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage"
          element={
            <ProtectedRoute>
              <ApplicationManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
