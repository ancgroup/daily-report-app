import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const DailyReportListPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  const fetchReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select(`id, report_date, site_name, location, last_km, run_km, status, issue_detail,
        vehicles ( id, name ), drivers ( id, name )`)
      .order("report_date", { ascending: false });
    if (data) setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;
    await supabase.from("reports").delete().eq("id", id);
    fetchReports();
  };

  const filteredReports = reports.filter((r) =>
    filterDate ? r.report_date === filterDate : true
  );

  const grouped = filteredReports.reduce((acc: any, r) => {
    const v = r.vehicles?.name || "不明車両";
    if (!acc[v]) acc[v] = [];
    acc[v].push(r);
    return acc;
  }, {});

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📋 車輛日報一覧</h2>
      <div>
        <Link to="/report/new"><button>＋ 新しい日報</button></Link>{" "}
        <Link to="/"><button>TOPへ戻る</button></Link>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <label>
          日付フィルタ：
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        </label>{" "}
        <button onClick={() => setFilterDate("")}>クリア</button>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p>まだ日報がありません。</p>
      ) : (
        Object.entries(grouped).map(([vehicle, list]) => (
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
                {list.map((r: any) => (
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
