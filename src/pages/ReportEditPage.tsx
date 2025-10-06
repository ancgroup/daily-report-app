// src/pages/ReportEditPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

interface Driver {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  name: string;
}

const ReportEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [site, setSite] = useState("");
  const [destination, setDestination] = useState("");
  const [lastKm, setLastKm] = useState<number>(0);
  const [status, setStatus] = useState("良好");
  const [issueDetail, setIssueDetail] = useState("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // 運転者と車両リスト
      const { data: dData } = await supabase.from("drivers").select("*");
      if (dData) setDrivers(dData);

      const { data: vData } = await supabase.from("vehicles").select("*");
      if (vData) setVehicles(vData);

      // 編集対象の日報取得
      const { data } = await supabase.from("reports").select("*").eq("id", id).single();
      if (data) {
        setDate(data.report_date);
        setVehicleId(data.vehicle_id);
        setDriverId(data.driver_id);
        setSite(data.site_name);
        setDestination(data.location);
        setLastKm(data.last_km);
        setStatus(data.status);
        setIssueDetail(data.issue_detail || "");
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    const { error } = await supabase.from("reports").update({
      report_date: date,
      vehicle_id: vehicleId,
      driver_id: driverId,
      site_name: site,
      location: destination,
      last_km: lastKm,
      status,
      issue_detail: status === "不具合" ? issueDetail : null,
    }).eq("id", id);

    if (error) {
      console.error("更新エラー:", error);
      setMessage("更新に失敗しました");
    } else {
      setMessage("更新しました");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>✏️ 日報編集</h2>
      <div>
        <label>
          日付：
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          車両：
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
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
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          現場名：
          <input type="text" value={site} onChange={(e) => setSite(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          移動場所：
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          最終走行距離：
          <input type="number" value={lastKm} onChange={(e) => setLastKm(Number(e.target.value))} /> km
        </label>
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
        <button onClick={handleUpdate}>更新</button>{" "}
        <button onClick={() => navigate("/reports")}>一覧へ戻る</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ReportEditPage;
