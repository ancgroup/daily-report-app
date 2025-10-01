import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VehicleContext } from "../context/VehicleContext";
import { ReportContext } from "../context/ReportContext";

const TopPage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles } = useContext(VehicleContext)!;
  const { reports } = useContext(ReportContext)!;

  const getLastMileage = (vehicleId: string) => {
    const vehicleReports = reports.filter(
      (r) => String(r.vehicleId) === String(vehicleId)
    );
    if (vehicleReports.length === 0) return 0;
    return Math.max(...vehicleReports.map((r) => r.mileage));
  };

  const getLatestReport = (vehicleId: string) => {
    const vehicleReports = reports
      .filter((r) => String(r.vehicleId) === String(vehicleId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return vehicleReports.length > 0 ? vehicleReports[0] : null;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🚗 ANCカー日報</h1>
      <p>日々の業務お疲れ様です。</p>

      {/* 上段ボタン */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => navigate("/daily-report-form")}>日報作成</button>{" "}
        <button onClick={() => navigate("/daily-report-list")}>日報一覧</button>{" "}
        <button
          onClick={() => navigate("/data")}
          style={{ backgroundColor: "skyblue", color: "black" }}
        >
          データ保存・読込
        </button>
      </div>

      {/* 下段ボタン */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => navigate("/vehicle-register")}>車輛登録</button>{" "}
        <button onClick={() => navigate("/driver-register")}>運転者登録</button>
      </div>

      {/* 車両情報 */}
      <h2>🚙 車両情報</h2>
      {vehicles.length === 0 ? (
        <p>登録されている車両がありません。</p>
      ) : (
        vehicles.map((vehicle) => {
          const lastMileage = getLastMileage(vehicle.id);
          const lastReport = getLatestReport(vehicle.id);

          const lastOilOdo = Number(vehicle.oilChangeOdometer) || 0;
          const nextOilKm = lastOilOdo + 5000;
          const oilRemaining = nextOilKm - lastMileage;

          const needElement = vehicle.elementChanged ? "不要" : "要";

          // 🔴 状態が不具合かどうか
          const isBadCondition =
            lastReport && lastReport.condition === "不具合";

          // 🔴 オイル交換が近いかどうか
          const isOilDue = oilRemaining <= 500;

          return (
            <div
              key={vehicle.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>
                {vehicle.name}{" "}
                {isOilDue && (
                  <span style={{ color: "red", marginLeft: "0.5rem" }}>
                    （オイル交換時期）
                  </span>
                )}
              </h3>
              <p>最終走行距離：{lastMileage} km</p>
              <p>
                次回オイル交換：{nextOilKm} km（あと{" "}
                {oilRemaining > 0 ? oilRemaining : 0} km）
              </p>
              <p>次回エレメント交換：{needElement}</p>
              {lastReport && (
                <>
                  <p>最終使用日：{lastReport.date}</p>
                  {isBadCondition ? (
                    <p style={{ color: "red" }}>
                      状態：不具合 <br />
                      備考：{lastReport.notes || "（未記入）"}
                    </p>
                  ) : (
                    <p>状態：{lastReport.condition}</p>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TopPage;
