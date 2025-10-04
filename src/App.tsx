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

// 認証チェック用
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  return loggedIn ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* ログイン画面 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 以下はログイン必須 */}
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
