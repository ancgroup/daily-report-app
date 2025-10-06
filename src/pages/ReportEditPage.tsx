// src/pages/ReportEditPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Footer from "../components/Footer";

const ReportEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [status, setStatus] = useState("良好");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("reports").select("*").eq("id", id).single();
      if (data) {
        setReport(data);
        setStatus(data.status);
      }
      const { data: dData } = await supabase.from("drivers").select("*");
      if (dData) setDrivers(dData);
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!report) return;
    const { error } = await supabase.from("reports").update({
      report_date: report.report_date,
      driver_id: report.driver_id,
      site_name: report.site_name,
      location: report.location,
      last_km: report.last_km,
      status,
      issue_detail: status === "不具合" ? report.issue_detail : null,
    }).eq("id", id);

    if (!error) {
      navigate("/reports");
    }
  };

  if (!report) return <p>読み込み中...</p>;

  return (
    <div className="app-container">
      <div className="content" style={{ padding: "1rem" }}>
        <h2>✏️ 日報編集</h2>

        <div>
          <label>日付：
            <input type="date" value={report.report_date} onChange={(e) => setReport({ ...report, report_date: e.target.value })} />
          </label>
        </div>

        <div>
          <label>運転者：
            <select value={report.driver_id} onChange={(e) => setReport({ ...report, driver_id: e.target.value })}>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>
        </div>

        <div>
          <label>現場名：
            <input value={report.site_name} onChange={(e) => setReport({ ...report, site_name: e.target.value })} />
          </label>
        </div>

        <div>
          <label>移動場所：
            <input value={report.location} onChange={(e) => setReport({ ...report, location: e.target.value })} />
          </label>
        </div>

        <div>
          <label>最終走行距離：
            <input type="number" value={report.last_km} onChange={(e) => setReport({ ...report, last_km: Number(e.target.value) })} /> km
          </label>
        </div>

        <div>
          <label>状況：
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="良好">良好</option>
              <option value="不具合">不具合</option>
            </select>
          </label>
        </div>

        {status === "不具合" && (
          <div>
            <label>不具合内容：
              <input value={report.issue_detail || ""} onChange={(e) => setReport({ ...report, issue_detail: e.target.value })} />
            </label>
          </div>
        )}

        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleSave}>更新</button>{" "}
          <button onClick={() => navigate("/reports")}>戻る</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReportEditPage;
