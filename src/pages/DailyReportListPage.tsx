// src/pages/DailyReportListPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const DailyReportListPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select(`
        id, report_date, site_name, location, last_km, run_km, status, issue_detail,
        vehicles ( id, name ),
        drivers ( id, name )
      `)
      .order("report_date", { ascending: false });
    if (data) setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;
    await supabase.from("reports").delete().eq("id", id);
    fetchReports();
  };

  return (
    <div className="app-container">
      <div className="content" style={{ padding: "1rem" }}>
        <h2>📋 車輛日報一覧</h2>
        <div>
          <Link to="/report/new"><button>＋ 新しい日報</button></Link>{" "}
          <Link to="/"><button>TOPへ戻る</button></Link>
        </div>

        {reports.length === 0 ? (
          <p>まだ日報がありません。</p>
        ) : (
          <table border={1} cellPadding={4} style={{ width: "100%", marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>日付</th>
                <th>車輛</th>
                <th>運転者</th>
                <th>現場名</th>
                <th>移動場所</th>
                <th>最終距離</th>
                <th>当日距離</th>
                <th>状況</th>
                <th>不具合内容</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.report_date}</td>
                  <td>{r.vehicles?.name}</td>
                  <td>{r.drivers?.name}</td>
                  <td>{r.site_name}</td>
                  <td>{r.location}</td>
                  <td>{r.last_km} km</td>
                  <td>{r.run_km} km</td>
                  <td style={{ color: r.status === "不具合" ? "red" : "black" }}>{r.status}</td>
                  <td style={{ color: "red" }}>{r.issue_detail || ""}</td>
                  <td>
                    <button onClick={() => navigate(`/report/edit/${r.id}`)}>編集</button>{" "}
                    <button onClick={() => handleDelete(r.id)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DailyReportListPage;
