// src/pages/ReportEditPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Vehicle {
  id: string;
  name: string;
}

interface Driver {
  id: string;
  name: string;
}

const ReportEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [site, setSite] = useState("");
  const [destination, setDestination] = useState("");
  const [lastKm, setLastKm] = useState<number>(0);
  const [status, setStatus] = useState("良好");
  const [issueDetail, setIssueDetail] = useState("");
  const [message, setMessage] = useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [sites, setSites] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: vData } = await supabase.from("vehicles").select("id, name").order("created_at", { ascending: false });
      if (vData) setVehicles(vData);

      const { data: dData } = await supabase.from("drivers").select("id, name").order("created_at", { ascending: false });
      if (dData) setDrivers(dData);

      const { data: rData } = await supabase.from("reports").select("site_name, location");
      if (rData) {
        setSites(Array.from(new Set(rData.map((r) => r.site_name).filter(Boolean))));
        setDestinations(Array.from(new Set(rData.map((r) => r.location).filter(Boolean))));
      }

      if (id) {
        const { data, error } = await supabase.from("reports").select("*").eq("id", id).single();
        if (!error && data) {
          setDate(data.report_date);
          setVehicleId(data.vehicle_id);
          setDriverId(data.driver_id);
          setSite(data.site_name || "");
          setDestination(data.location || "");
          setLastKm(data.last_km || 0);
          setStatus(data.status || "良好");
          setIssueDetail(data.issue_detail || "");
        }
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (!vehicleId || !driverId) {
      setMessage("車両と運転者を選択してください");
      return;
    }

    const { data: prevData } = await supabase
      .from("reports")
      .select("last_km, report_date")
      .eq("vehicle_id", vehicleId)
      .lt("report_date", date)
      .order("report_date", { ascending: false })
      .limit(1);

    const prevKm = prevData && prevData.length > 0 ? prevData[0].last_km : 0;
    const runKm = lastKm - prevKm;

    const { error } = await supabase.from("reports").update({
      report_date: date,
      vehicle_id: vehicleId,
      driver_id: driverId,
      site_name: site,
      location: destination,
      last_km: lastKm,
      run_km: runKm,
      status,
      issue_detail: status === "不具合" ? issueDetail : null,
    }).eq("id", id);

    if (error) {
      console.error("日報更新エラー:", error);
      setMessage("更新に失敗しました");
    } else {
      setMessage("日報を更新しました");
      navigate("/reports");
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
          <input list="site-list" value={site} onChange={(e) => setSite(e.target.value)} />
          <datalist id="site-list">
            {sites.map((s, i) => <option key={i} value={s} />)}
          </datalist>
        </label>
      </div>

      <div>
        <label>
          移動場所：
          <input list="dest-list" value={destination} onChange={(e) => setDestination(e.target.value)} />
          <datalist id="dest-list">
            {destinations.map((d, i) => <option key={i} value={d} />)}
          </datalist>
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
