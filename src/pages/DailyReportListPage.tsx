import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReportContext } from "../context/ReportContext";
import { VehicleContext } from "../context/VehicleContext";
import { DriverContext } from "../context/DriverContext";

const DailyReportListPage: React.FC = () => {
  const { reports, deleteReport, setEditingReport } = useContext(ReportContext)!;
  const { vehicles } = useContext(VehicleContext)!;
  const { drivers } = useContext(DriverContext)!;
  const navigate = useNavigate();

  const getVehicleName = (vehicleId: string) => {
    const v = vehicles.find((v) => String(v.id) === String(vehicleId));
    return v ? v.name : "不明車両";
  };

  const getDriverName = (driverId: string) => {
    const d = drivers.find((d) => String(d.id) === String(driverId));
    return d ? d.name : "不明運転者";
  };

  // 🔹 車両ごとにレポートをグループ化
  const groupedReports: { [vehicleId: string]: typeof reports } = {};
  reports.forEach((r) => {
    if (!groupedReports[r.vehicleId]) {
      groupedReports[r.vehicleId] = [];
    }
    groupedReports[r.vehicleId].push(r);
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 日報一覧</h2>
      <button onClick={() => navigate("/")}>TOPへ戻る</button>

      {Object.keys(groupedReports).length === 0 ? (
        <p>日報がまだ登録されていません。</p>
      ) : (
        Object.keys(groupedReports).map((vehicleId) => {
          const vehicleReports = groupedReports[vehicleId].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          return (
            <div key={vehicleId} style={{ marginTop: "2rem" }}>
              <h3>🚙 {getVehicleName(vehicleId)}</h3>
              <table border={1} cellPadding={5} style={{ marginTop: "0.5rem", width: "100%" }}>
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>運転者</th>
                    <th>現場名</th>
                    <th>移動場所</th>
                    <th>走行距離</th>
                    <th>状態</th>
                    <th>備考</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleReports.map((r) => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>{getDriverName(r.driverId)}</td>
                      <td>{r.site}</td>
                      <td>{r.destination}</td>
                      <td>{r.mileage} km</td>
                      <td>{r.condition}</td>
                      <td>{r.notes}</td>
                      <td>
                        <button
                          onClick={() => {
                            setEditingReport(r);
                            navigate("/daily-report-form");
                          }}
                        >
                          編集
                        </button>{" "}
                        <button onClick={() => deleteReport(r.id)}>削除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DailyReportListPage;
