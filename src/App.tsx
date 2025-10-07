// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TopPage from "./pages/TopPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import ReportNewPage from "./pages/ReportNewPage";
import ReportEditPage from "./pages/ReportEditPage";
import DailyReportListPage from "./pages/DailyReportListPage";
import LoginPage from "./pages/LoginPage";

const isAuthenticated = () => localStorage.getItem("isLoggedIn") === "true";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TopPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <VehicleRegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <ProtectedRoute>
            <DriverRegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/new"
        element={
          <ProtectedRoute>
            <ReportNewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/edit/:id"
        element={
          <ProtectedRoute>
            <ReportEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <DailyReportListPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
