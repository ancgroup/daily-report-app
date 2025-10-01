import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TopPage from "./pages/TopPage";
import LoginPage from "./pages/LoginPage";
import DailyReportFormPage from "./pages/DailyReportFormPage";
import DailyReportListPage from "./pages/DailyReportListPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import DataPage from "./pages/DataPage";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuth = localStorage.getItem("authenticated") === "true";
  return isAuth ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ログインページ */}
        <Route path="/login" element={<LoginPage />} />

        {/* 認証が必要なページ */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <TopPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-report-form"
          element={
            <PrivateRoute>
              <DailyReportFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-report-list"
          element={
            <PrivateRoute>
              <DailyReportListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/vehicle-register"
          element={
            <PrivateRoute>
              <VehicleRegisterPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/driver-register"
          element={
            <PrivateRoute>
              <DriverRegisterPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/data"
          element={
            <PrivateRoute>
              <DataPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
