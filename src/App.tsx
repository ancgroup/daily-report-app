// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TopPage from "./pages/TopPage";
import VehicleRegisterPage from "./pages/VehicleRegisterPage";
import DriverRegisterPage from "./pages/DriverRegisterPage";
import ReportNewPage from "./pages/ReportNewPage";
import ReportEditPage from "./pages/ReportEditPage";
import DailyReportListPage from "./pages/DailyReportListPage";
// LoginPage は使用しないため、インポートを削除しても問題ありません。

const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. 直接各ページを表示するように変更 */}
      <Route path="/" element={<TopPage />} />
      <Route path="/vehicles" element={<VehicleRegisterPage />} />
      <Route path="/drivers" element={<DriverRegisterPage />} />
      <Route path="/report/new" element={<ReportNewPage />} />
      <Route path="/report/edit/:id" element={<ReportEditPage />} />
      <Route path="/reports" element={<DailyReportListPage />} />

      {/* 2. 存在しないURLに入力があった場合は、トップページへ戻るように設定 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
