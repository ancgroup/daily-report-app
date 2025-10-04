import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ReportEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const { data } = await supabase.from("reports").select("*").eq("id", id).single();
      if (data) setReport(data);
    };
    fetchReport();
  }, [id]);

  const handleSave = async () => {
    const { error } = await supabase.from("reports").update(report).eq("id", id);
    if (error) {
      console.error(error);
      setMessage("更新に失敗しました");
    } else {
      setMessage("更新しました");
    }
  };

  if (!report) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>✏️ 日報編集</h2>
      <div>
        <label>日付：<input type="date" value={report.report_date} onChange={(e) => setReport({ ...report, report_date: e.target.value })} /></label>
      </div>
      <div>
        <label>現場名：<input value={report.site_name || ""} onChange={(e) => setReport({ ...report, site_name: e.target.value })} /></label>
      </div>
      <div>
        <label>移動場所：<input value={report.location || ""} onChange={(e) => setReport({ ...report, location: e.target.value })} /></label>
      </div>
      <div>
        <label>最終距離：<input type="number" value={report.last_km || 0} onChange={(e) => setReport({ ...report, last_km: Number(e.target.value) })} /></label>
      </div>
      <div>
        <label>当日距離：<input type="number" value={report.run_km || 0} onChange={(e) => setReport({ ...report, run_km: Number(e.target.value) })} /></label>
      </div>
      <div>
        <label>状況：
          <select value={report.status} onChange={(e) => setReport({ ...report, status: e.target.value })}>
            <option value="良好">良好</option>
            <option value="不具合">不具合</option>
          </select>
        </label>
      </div>
      {report.status === "不具合" && (
        <div>
          <label>不具合内容：<input value={report.issue_detail || ""} onChange={(e) => setReport({ ...report, issue_detail: e.target.value })} /></label>
        </div>
      )}
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSave}>更新</button>{" "}
        <button onClick={() => navigate("/reports")}>一覧へ戻る</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReportEditPage;
