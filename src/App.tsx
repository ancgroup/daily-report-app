// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import TopPage from "./pages/TopPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import ReportNewPage from "./pages/ReportNewPage";
import ReportEditPage from "./pages/ReportEditPage";
import DailyReportListPage from "./pages/DailyReportListPage";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/vehicles" element={<VehicleRegisterPage />} />
        <Route path="/drivers" element={<DriverRegisterPage />} />
        <Route path="/report/new" element={<ReportNewPage />} />
        <Route path="/report/edit/:id" element={<ReportEditPage />} />
        <Route path="/reports" element={<DailyReportListPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
