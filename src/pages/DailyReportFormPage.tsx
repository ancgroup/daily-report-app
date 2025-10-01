import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReportContext } from "../context/ReportContext";
import { VehicleContext } from "../context/VehicleContext";
import { DriverContext } from "../context/DriverContext";

const DailyReportFormPage: React.FC = () => {
  const { addReport } = useContext(ReportContext)!;
  const { vehicles } = useContext(VehicleContext)!;
  const { drivers } = useContext(DriverContext)!;
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0]; // 今日の日付

  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [date, setDate] = useState(today);
  const [site, setSite] = useState("");
  const [destination, setDestination] = useState("");
  const [mileage, setMileage] = useState(0);
  const [condition, setCondition] = useState("良好");
  const [notes, setNotes] = useState("");

  // 🔹 過去入力値を取得
  const pastSites = Array.from(new Set(JSON.parse(localStorage.getItem("sites") || "[]")));
  const pastDestinations = Array.from(new Set(JSON.parse(localStorage.getItem("destinations") || "[]")));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport = {
      id: Date.now().toString(),
      vehicleId,
      driverId,
      date,
      site,
      destination,
      mileage,
      condition,
      notes,
    };
    addReport(newReport);

    // 🔹 入力履歴を保存
    if (site && !pastSites.includes(site)) {
      localStorage.setItem("sites", JSON.stringify([...pastSites, site]));
    }
    if (destination && !pastDestinations.includes(destination)) {
      localStorage.setItem("destinations", JSON.stringify([...pastDestinations, destination]));
    }

    alert("本日もお疲れ様でした");
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📑 日報作成</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>車両：</label>
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">選択してください</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>運転者：</label>
          <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">選択してください</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>日付：</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>現場名：</label>
          <input
            type="text"
            list="siteOptions"
            value={site}
            onChange={(e) => setSite(e.target.value)}
          />
          <datalist id="siteOptions">
            {pastSites.map((s, idx) => (
              <option key={idx} value={s} />
            ))}
          </datalist>
        </div>

        <div>
          <label>移動場所：</label>
          <input
            type="text"
            list="destinationOptions"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <datalist id="destinationOptions">
            {pastDestinations.map((d, idx) => (
              <option key={idx} value={d} />
            ))}
          </datalist>
        </div>

        <div>
          <label>最終走行距離：</label>
          <input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
          /> km
        </div>

        <div>
          <label>車両の状態：</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="良好">良好</option>
            <option value="不具合">不具合</option>
          </select>
        </div>

        <div>
          <label>備考：</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <button type="submit">保存</button>{" "}
        <button type="button" onClick={() => navigate("/")}>TOPへ戻る</button>
      </form>
    </div>
  );
};

export default DailyReportFormPage;
