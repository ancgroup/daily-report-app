// src/pages/TopPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Vehicle {
  id: string;
  name: string;
  last_km: number;
  oil_change_km: number;
  element_count: number;
}

interface Report {
  id: string;
  report_date: string;
  last_km: number;
  status: string;
  issue_detail: string | null;
}

const TopPage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [latestReports, setLatestReports] = useState<Record<string, Report | null>>({});

  // 車両情報と直近日報取得
  useEffect(() => {
    const fetchData = async () => {
      const { data: vData } = await supabase.from("vehicles").select("*");
      if (vData) setVehicles(vData);

      const reportsByVehicle: Record<string, Report | null> = {};
      for (const v of vData || []) {
        const { data: rData } = await supabase
          .from("reports")
          .select("*")
          .eq("vehicle_id", v.id)
          .order("report_date", { ascending: false })
          .limit(1);

        reportsByVehicle[v.id] = rData && rData.length > 0 ? rData[0] : null;
      }
      setLatestReports(reportsByVehicle);
    };
    fetchData();
  }, []);

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🚗 車輛日報</h1>
      <div style={{ marginTop: "1rem" }}>
        <Link to="/report/new"><button>日報作成</button></Link>{" "}
        <Link to="/reports"><button>日報一覧</button></Link>{" "}
        <Link to="/vehicles"><button>車輛登録</button></Link>{" "}
        <Link to="/drivers"><button>運転者登録</button></Link>{" "}
        <button onClick={handleLogout} style={{ marginLeft: "1rem", color: "red" }}>
          ログアウト
        </button>
      </div>

      <h2 style={{ marginTop: "2rem" }}>🚙 車輛情報</h2>
      {vehicles.map((v) => {
        const report = latestReports[v.id];
        const nextOilKm = v.oil_change_km + 5000;
        const remain = nextOilKm - (v.last_km || 0);
        const elementNeeded = v.element_count % 2 === 0 ? "不要" : "要";

        return (
          <div
            key={v.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              margin: "0.5rem 0",
              padding: "0.5rem",
            }}
          >
            <h3>{v.name}</h3>
            <p>
              オイル交換まで残り:{" "}
              <span style={{ color: remain <= 500 ? "red" : "black" }}>
                {remain} km
              </span>
            </p>
            <p>次回エレメント交換: {elementNeeded}</p>
            {report && (
              <>
                <p>最終距離: {report.last_km} km</p>
                <p style={{ color: report.status === "不具合" ? "red" : "black" }}>
                  状況: {report.status}
                </p>
                {report.status === "不具合" && report.issue_detail && (
                  <p style={{ color: "red" }}>不具合内容: {report.issue_detail}</p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TopPage;
