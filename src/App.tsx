// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TopPage from "./pages/TopPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import ReportNewPage from "./pages/ReportNewPage";
import ReportEditPage from "./pages/ReportEditPage";
import DailyReportListPage from "./pages/DailyReportListPage";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {isLoggedIn ? (
          <>
            <Route path="/" element={<TopPage />} />
            <Route path="/vehicles" element={<VehicleRegisterPage />} />
            <Route path="/drivers" element={<DriverRegisterPage />} />
            <Route path="/report/new" element={<ReportNewPage />} />
            <Route path="/report/edit/:id" element={<ReportEditPage />} />
            <Route path="/reports" element={<DailyReportListPage />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
