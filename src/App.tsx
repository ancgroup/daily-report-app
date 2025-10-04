// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import TopPage from "./pages/TopPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import ReportNewPage from "./pages/ReportNewPage";
import ReportEditPage from "./pages/ReportEditPage";
import DailyReportListPage from "./pages/DailyReportListPage";

const App: React.FC = () => {
  return (
    <Routes>
      {/* TOPページ */}
      <Route path="/" element={<TopPage />} />

      {/* 車輛登録 */}
      <Route path="/vehicles" element={<VehicleRegisterPage />} />

      {/* 運転者登録 */}
      <Route path="/drivers" element={<DriverRegisterPage />} />

      {/* 日報作成 */}
      <Route path="/report/new" element={<ReportNewPage />} />

      {/* 日報編集 */}
      <Route path="/report/edit/:id" element={<ReportEditPage />} />

      {/* 日報一覧 */}
      <Route path="/reports" element={<DailyReportListPage />} />
    </Routes>
  );
};

export default App;
