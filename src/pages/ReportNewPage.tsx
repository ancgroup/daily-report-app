// src/pages/ReportNewPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

interface Vehicle {
  id: string;
  name: string;
  last_km: number;
}

interface Driver {
  id: string;
  name: string;
}

const ReportNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [site, setSite] = useState("");
  const [destination, setDestination] = useState("");
  const [lastKm, setLastKm] = useState<number>(0);
  const [previousKm, setPreviousKm] = useState<number>(0);
  const [status, setStatus] = useState("良好");
  const [issueDetail, setIssueDetail] = useState("");
  const [message, setMessage] = useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: vData } = await supabase.from("vehicles").select("*");
      if (vData) setVehicles(vData);

      const { data: dData } = await supabase.from("drivers").select("*");
      if (dData) setDrivers(dData);
    };
    fetchData();
  }, []);

  const handleDateChange = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]);
  };

  const handleSave = async () => {
    if (!vehicleId || !driverId) {
      setMessage("車両と運転者を選択してください");
      return;
    }

    const runKm = lastKm - previousKm;

    const { error } = await supabase.from("reports").insert([
      {
        report_date: date,
        vehicle_id: vehicleId,
        driver_id: driverId,
        site_name: site,
        location: destination,
        last_km: lastKm,
        run_km: runKm,
        status,
        issue_detail: status === "不具合" ? issueDetail : null,
      },
    ]);

    if (error) {
      setMessage("保存に失敗しました");
    } else {
      await supabase.from("vehicles").update({ last_km: lastKm }).eq("id", vehicleId);
      setMessage("本日もお疲れ様でした");
    }
  };

  return (
    <div style={{ padding: "1rem", position: "relative", minHeight: "100vh" }}>
      <h2>📝 車輛日報作成</h2>

      <div>
        <label>
          日付：
          <button onClick={() => handleDateChange(-1)}>←</button>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button onClick={() => handleDateChange(1)}>→</button>
        </label>
      </div>

      <div>
        <label>
          車両：
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">選択してください</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          運転者：
          <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">選択してください</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          現場名：
          <input value={site} onChange={(e) => setSite(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          移動場所：
          <input value={destination} onChange={(e) => setDestination(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          最終走行距離：
          <input type="number" value={lastKm} onChange={(e) => setLastKm(Number(e.target.value))} /> km
        </label>
      </div>

      <div>
        <p>当日走行距離：{lastKm - previousKm} km</p>
      </div>

      <div>
        <label>
          状況：
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="良好">良好</option>
            <option value="不具合">不具合</option>
          </select>
        </label>
      </div>

      {status === "不具合" && (
        <div>
          <label>
            不具合内容：
            <input type="text" value={issueDetail} onChange={(e) => setIssueDetail(e.target.value)} />
          </label>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSave}>保存</button>{" "}
        <button onClick={() => navigate("/")}>TOPへ戻る</button>
      </div>

      {message && <p>{message}</p>}
      <Footer />
    </div>
  );
};

export default ReportNewPage;
