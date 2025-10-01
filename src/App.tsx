import React from "react";
import { Routes, Route } from "react-router-dom";
import TopPage from "./pages/TopPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import DailyReportFormPage from "./pages/DailyReportFormPage";
import DailyReportListPage from "./pages/DailyReportListPage";
import DataPage from "./pages/DataPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/vehicle-register" element={<VehicleRegisterPage />} /> {/* 修正 */}
      <Route path="/driver-register" element={<DriverRegisterPage />} />   {/* 修正 */}
      <Route path="/daily-report-form" element={<DailyReportFormPage />} />
      <Route path="/daily-report-list" element={<DailyReportListPage />} />
      <Route path="/data" element={<DataPage />} />
    </Routes>
  );
};

export default App;
