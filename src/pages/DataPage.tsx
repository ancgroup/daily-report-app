import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReportContext } from "../context/ReportContext";
import { VehicleContext } from "../context/VehicleContext";
import { DriverContext } from "../context/DriverContext";

const DataPage: React.FC = () => {
  const { reports, setReports } = useContext(ReportContext)!;
  const { vehicles, setVehicles } = useContext(VehicleContext)!;
  const { drivers, setDrivers } = useContext(DriverContext)!;
  const navigate = useNavigate();

  // JSON出力（バックアップ）
  const handleExport = () => {
    const data = { vehicles, drivers, reports };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "daily_data_backup.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON入力（復元）
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return;

        const jsonData = JSON.parse(text);

        if (jsonData.vehicles) setVehicles(jsonData.vehicles);
        if (jsonData.drivers) setDrivers(jsonData.drivers);
        if (jsonData.reports) setReports(jsonData.reports);

        alert("バックアップデータを読み込みました ✅");
      } catch (error) {
        alert("データの読み込みに失敗しました ❌");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💾 データ保存・読込（バックアップ用）</h2>
      <p>普段の利用データは自動的にブラウザに保存されています。</p>
      <p>必要に応じてバックアップを保存・復元してください。</p>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleExport}>バックアップ保存</button>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <input type="file" accept=".json" onChange={handleImport} />
      </div>

      <button onClick={() => navigate("/")}>TOPへ戻る</button>
    </div>
  );
};

export default DataPage;
