import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Vehicle {
  id: string;
  name: string;
  last_km: number;
  oil_change_km: number;
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
  const [latestReports, setLatestReports] = useState<Record<string, Report>>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: vData } = await supabase.from("vehicles").select("*");
      if (vData) setVehicles(vData);

      const { data: rData } = await supabase
        .from("reports")
        .select("*")
        .order("report_date", { ascending: false });

      if (rData) {
        const latest: Record<string, Report> = {};
        rData.forEach((r) => {
          if (!latest[r.vehicle_id]) {
            latest[r.vehicle_id] = r;
          }
        });
        setLatestReports(latest);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🚗 車輛日報</h1>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/report/new"><button>日報作成</button></Link>{" "}
        <Link to="/reports"><button>日報一覧</button></Link>{" "}
        <Link to="/vehicles"><button>車輛登録</button></Link>{" "}
        <Link to="/drivers"><button>運転者登録</button></Link>
      </div>

      <h2>📋 車輛情報</h2>
      {vehicles.map((v) => {
        const report = latestReports[v.id];
        const nextOil = v.oil_change_km + 5000;
        const remain = nextOil - (v.last_km || 0);

        return (
          <div key={v.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "0.5rem", marginBottom: "1rem" }}>
            <h3>🚙 {v.name}</h3>
            <p>最終距離: {v.last_km} km</p>
            <p style={{ color: remain <= 500 ? "red" : "black" }}>
              オイル交換まで残り {remain} km
            </p>
            <p>
              次回エレメント交換: {Math.floor(v.oil_change_km / 5000) % 2 === 1 ? "要" : "不要"}
            </p>
            {report && (
              <>
                <p>状況: <span style={{ color: report.status === "不具合" ? "red" : "black" }}>{report.status}</span></p>
                {report.status === "不具合" && <p style={{ color: "red" }}>不具合内容: {report.issue_detail}</p>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TopPage;
