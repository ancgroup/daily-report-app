import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import TopPage from "./pages/TopPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import ReportNewPage from "./pages/ReportNewPage";
import ReportEditPage from "./pages/ReportEditPage";
import DailyReportListPage from "./pages/DailyReportListPage";

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Routes>
      {/* ログインページ */}
      <Route path="/" element={<LoginPage />} />

      {/* TOPページ（ログイン済み必須） */}
      <Route
        path="/top"
        element={isLoggedIn ? <TopPage /> : <Navigate to="/" />}
      />

      {/* 各機能ページ */}
      <Route path="/vehicles" element={isLoggedIn ? <VehicleRegisterPage /> : <Navigate to="/" />} />
      <Route path="/drivers" element={isLoggedIn ? <DriverRegisterPage /> : <Navigate to="/" />} />
      <Route path="/report/new" element={isLoggedIn ? <ReportNewPage /> : <Navigate to="/" />} />
      <Route path="/report/edit/:id" element={isLoggedIn ? <ReportEditPage /> : <Navigate to="/" />} />
      <Route path="/reports" element={isLoggedIn ? <DailyReportListPage /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;
