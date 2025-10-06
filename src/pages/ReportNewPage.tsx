// src/pages/ReportNewPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

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

  // 入力項目
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [site, setSite] = useState("");
  const [destination, setDestination] = useState("");
  const [lastKm, setLastKm] = useState<number>(0);
  const [previousKm, setPreviousKm] = useState<number>(0); // 前回最終距離
  const [status, setStatus] = useState("良好");
  const [issueDetail, setIssueDetail] = useState("");
  const [message, setMessage] = useState("");

  // 過去データ保持
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [sites, setSites] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  // 車両・運転者・過去入力値取得
  useEffect(() => {
    const fetchData = async () => {
      const { data: vData } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
      if (vData) setVehicles(vData);

      const { data: dData } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
      if (dData) setDrivers(dData);

      const { data: rData } = await supabase.from("reports").select("site_name, location");
      if (rData) {
        setSites(Array.from(new Set(rData.map((r) => r.site_name).filter(Boolean))));
        setDestinations(Array.from(new Set(rData.map((r) => r.location).filter(Boolean))));
      }
    };
    fetchData();
  }, []);

  // 車両選択時 → 直近の最終距離を取得
  useEffect(() => {
    const fetchLastKm = async () => {
      if (!vehicleId) return;

      const { data } = await supabase
        .from("reports")
        .select("last_km")
        .eq("vehicle_id", vehicleId)
        .order("report_date", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setPreviousKm(data[0].last_km || 0);
        setLastKm(data[0].last_km || 0);
      } else {
        setPreviousKm(0);
        setLastKm(0);
      }
    };

    fetchLastKm();
  }, [vehicleId]);

  // 保存処理（安全版：保存後に再計算）
  const handleSave = async () => {
    if (!vehicleId || !driverId) {
      setMessage("車両と運転者を選択してください");
      return;
    }

    // 1. 新しい日報を保存
    const { error: insertError } = await supabase.from("reports").insert([
      {
        report_date: date,
        vehicle_id: vehicleId,
        driver_id: driverId,
        site_name: site,
        location: destination,
        last_km: lastKm,
        status,
        issue_detail: status === "不具合" ? issueDetail : null,
      },
    ]);

    if (insertError) {
      console.error("日報保存エラー:", insertError);
      setMessage("保存に失敗しました");
      return;
    }

    // 2. 全日報を取得して run_km を再計算
    const { data: reports, error: fetchError } = await supabase
      .from("reports")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("report_date", { ascending: true });

    if (fetchError || !reports) {
      console.error("再計算取得エラー:", fetchError);
      return;
    }

    let prevKm = 0;
    for (const r of reports) {
      const runKm = r.last_km - prevKm;
      await supabase.from("reports").update({ run_km: runKm }).eq("id", r.id);
      prevKm = r.last_km;
    }

    // 3. 車両テーブル更新（最新距離）
    const latest = reports[reports.length - 1];
    if (latest) {
      await supabase.from("vehicles").update({ last_km: latest.last_km }).eq("id", vehicleId);
    }

    setMessage("本日もお疲れ様でした");
  };

  // 日付移動
  const handleDateChange = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <div style={{ padding: "1rem" }}>
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
    </div>
  );
};

export default ReportNewPage;
