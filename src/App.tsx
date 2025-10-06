import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import TopPage from "./pages/TopPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import ReportNewPage from "./pages/ReportNewPage";
import ReportEditPage from "./pages/ReportEditPage";
import DailyReportListPage from "./pages/DailyReportListPage";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = localStorage.getItem("auth") === "true";
  return isAuth ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <TopPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <PrivateRoute>
            <VehicleRegisterPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <PrivateRoute>
            <DriverRegisterPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/report/new"
        element={
          <PrivateRoute>
            <ReportNewPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/report/edit/:id"
        element={
          <PrivateRoute>
            <ReportEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <DailyReportListPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
