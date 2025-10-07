// src/pages/ReportNewPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

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

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [sites, setSites] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: vData } = await supabase.from("vehicles").select("*");
      const { data: dData } = await supabase.from("drivers").select("*");
      const { data: rData } = await supabase.from("reports").select("site_name, location");
      if (vData) setVehicles(vData);
      if (dData) setDrivers(dData);
      if (rData) {
        setSites([...new Set(rData.map((r) => r.site_name).filter(Boolean))]);
        setDestinations([...new Set(rData.map((r) => r.location).filter(Boolean))]);
      }
    };
    fetchData();
  }, []);

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

  const handleDateChange = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]);
  };

  const handleSave = async () => {
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
      console.error(error);
      setMessage("保存に失敗しました");
    } else {
      setMessage("本日もお疲れ様でした");
    }
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

      {/* 以下は既存フォーム内容（省略可） */}
      {/* ... */}
    </div>
  );
};

export default ReportNewPage;
