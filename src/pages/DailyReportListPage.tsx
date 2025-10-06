// src/pages/DailyReportListPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

interface Report {
  id: string;
  report_date: string;
  site_name: string;
  location: string;
  last_km: number;
  run_km: number;
  status: string;
  issue_detail: string | null;
  vehicles: { id: string; name: string };
  drivers: { id: string; name: string };
}

const DailyReportListPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  // レポート取得
  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select(
        `
        id, report_date, site_name, location, last_km, run_km, status, issue_detail,
        vehicles ( id, name ),
        drivers ( id, name )
      `
      )
      .order("report_date", { ascending: true });

    if (error) {
      console.error("日報取得エラー:", error);
      setLoading(false);
      return;
    }

    // 安全のため表示前に run_km 再計算
    const recalculated: any[] = [];
    const grouped: Record<string, any[]> = {};

    for (const r of data || []) {
      const vid = r.vehicles?.id || "unknown";
      if (!grouped[vid]) grouped[vid] = [];
      grouped[vid].push(r);
    }

    for (const vid in grouped) {
      let prevKm = 0;
      for (const r of grouped[vid]) {
        r.run_km = r.last_km - prevKm;
        prevKm = r.last_km;
        recalculated.push(r);
      }
    }

    setReports(recalculated);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("この日報を削除しますか？")) return;
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    } else {
      fetchReports();
    }
  };

  // フィルタ適用
  const filteredReports = reports.filter((r) => {
    return filterDate ? r.report_date === filterDate : true;
  });

  // 車両ごとにまとめる
  const groupedReports = filteredReports.reduce((acc: any, report) => {
    const vehicleName = report.vehicles?.name || "不明車両";
    if (!acc[vehicleName]) acc[vehicleName] = [];
    acc[vehicleName].push(report);
    return acc;
  }, {});

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📋 車輛日報一覧</h2>
      <div>
        <Link to="/report/new"><button>＋ 新しい日報</button></Link>{" "}
        <Link to="/"><button>TOPへ戻る</button></Link>
      </div>

      {/* フィルタ */}
      <div style={{ margin: "1rem 0" }}>
        <label>
          日付：
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        </label>{" "}
        <button onClick={() => setFilterDate("")}>クリア</button>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : Object.keys(groupedReports).length === 0 ? (
        <p>まだ日報がありません。</p>
      ) : (
        Object.entries(groupedReports).map(([vehicle, vehicleReports]) => (
          <div key={vehicle} style={{ marginTop: "1rem" }}>
            <h3>🚙 {vehicle}</h3>
            <table border={1} cellPadding={4} style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>日付</th>
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
                {vehicleReports.map((r: any) => (
                  <tr key={r.id}>
                    <td>{r.report_date}</td>
                    <td>{r.drivers?.name || "不明"}</td>
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
          </div>
        ))
      )}
    </div>
  );
};

export default DailyReportListPage;
