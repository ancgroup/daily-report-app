// src/pages/TopPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Vehicle {
  id: string;
  name: string;
  oil_change_km: number;   // 直近オイル交換距離
  oil_change_count: number; // オイル交換回数
}

interface Report {
  id: string;
  report_date: string;
  last_km: number;
  status: string;
  issue_detail: string | null;
  vehicle_id: string;
}

const TopPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [latestReports, setLatestReports] = useState<Record<string, Report | null>>({});
  const [message, setMessage] = useState("");

  // 車両・日報取得
  useEffect(() => {
    const fetchData = async () => {
      const { data: vData } = await supabase.from("vehicles").select("*");
      if (vData) setVehicles(vData);

      const latest: Record<string, Report | null> = {};
      for (const v of vData || []) {
        const { data: rData } = await supabase
          .from("reports")
          .select("*")
          .eq("vehicle_id", v.id)
          .order("report_date", { ascending: false })
          .limit(1);

        latest[v.id] = rData && rData.length > 0 ? rData[0] : null;
      }
      setLatestReports(latest);
    };

    fetchData();
  }, []);

  // オイル交換実施処理
  const handleOilChange = async (vehicle: Vehicle) => {
    const lastKm = latestReports[vehicle.id]?.last_km ?? 0;

    const { error } = await supabase
      .from("vehicles")
      .update({
        oil_change_km: lastKm,
        oil_change_count: vehicle.oil_change_count + 1,
      })
      .eq("id", vehicle.id);

    if (error) {
      console.error("オイル交換更新エラー:", error);
      setMessage("更新に失敗しました");
    } else {
      setMessage(`${vehicle.name} のオイル交換を登録しました`);
      // 再読み込み
      const { data: vData } = await supabase.from("vehicles").select("*");
      if (vData) setVehicles(vData);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🚗 車輛日報</h1>
      <div style={{ marginTop: "1rem" }}>
        <Link to="/report/new"><button>日報作成</button></Link>{" "}
        <Link to="/reports"><button>日報一覧</button></Link>{" "}
        <Link to="/vehicles"><button>車輛登録</button></Link>{" "}
        <Link to="/drivers"><button>運転者登録</button></Link>
      </div>

      <h2 style={{ marginTop: "2rem" }}>📊 車両状況</h2>
      {vehicles.map((v) => {
        const report = latestReports[v.id];
        const lastKm = report?.last_km ?? 0;

        // 次回オイル交換距離 = 登録時の交換距離 + 5000
        const nextOilChangeKm = (v.oil_change_km || 0) + 5000;
        const remain = nextOilChangeKm - lastKm;

        // 2回に1回エレメント交換
        const isElementChange = (v.oil_change_count + 1) % 2 === 1;

        return (
          <div
            key={v.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              margin: "1rem 0",
            }}
          >
            <h3>🚙 {v.name}</h3>
            <p>最終距離: {lastKm} km</p>
            <p>
              オイル交換まで残り:{" "}
              <span style={{ color: remain <= 500 ? "red" : "black" }}>
                {remain} km
              </span>
            </p>
            <p>
              次回エレメント交換:{" "}
              <span style={{ color: isElementChange ? "red" : "black" }}>
                {isElementChange ? "要" : "不要"}
              </span>
            </p>
            <p style={{ color: report?.status === "不具合" ? "red" : "black" }}>
              状況: {report?.status || "不明"}
            </p>
            {report?.status === "不具合" && report.issue_detail && (
              <p style={{ color: "red" }}>不具合内容: {report.issue_detail}</p>
            )}
            <button
              style={{ marginTop: "0.5rem" }}
              onClick={() => handleOilChange(v)}
            >
              オイル交換実施
            </button>
          </div>
        );
      })}

      {message && <p>{message}</p>}
    </div>
  );
};

export default TopPage;
