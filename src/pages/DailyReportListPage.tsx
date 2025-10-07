// src/pages/DailyReportListPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

interface Report {
  id: string;
  report_date: string;
  site_name: string;
  location: string;
  last_km: number | null;
  // run_km: number | null;  // DBのrun_kmは参照しない（表示は計算結果を使用）
  status: string;
  issue_detail: string | null;
  vehicles?: { id: string; name: string };
  drivers?: { id: string; name: string };
  // computed_run_km をランタイムで追加します
  computed_run_km?: number;
}

const DailyReportListPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select(`
        id, report_date, site_name, location, last_km, status, issue_detail,
        vehicles ( id, name ),
        drivers ( id, name )
      `)
      .order("report_date", { ascending: false });

    if (error) {
      console.error("日報取得エラー:", error);
      setReports([]);
      setLoading(false);
      return;
    }

    // data は配列（降順で取得されている）だが、グループごとに昇順で計算→降順で表示する。
    const arr = data || [];
    setReports(arr);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("この日報を削除しますか？")) return;
    await supabase.from("reports").delete().eq("id", id);
    await fetchReports();
  };

  // grouped: { [vehicleName]: Report[] }
  const grouped = ((): Record<string, Report[]> => {
    // グループ化（まず vehicle 名でまとめる）
    const groups: Record<string, Report[]> = {};
    for (const r of reports) {
      const vehicleName = r.vehicles?.name || "不明車輛";
      if (!groups[vehicleName]) groups[vehicleName] = [];
      groups[vehicleName].push({ ...r }); // コピー
    }

    // 各グループで昇順にソートして計算 → 表示用に降順へ
    Object.keys(groups).forEach((key) => {
      const list = groups[key];

      // 日付昇順 (古い→新しい) に並べるための比較
      const asc = list.slice().sort((a, b) => {
        const ta = new Date(a.report_date).getTime();
        const tb = new Date(b.report_date).getTime();
        // 同日なら id で安定ソート（任意）
        if (ta === tb) return (a.id > b.id ? 1 : -1);
        return ta - tb;
      });

      // 昇順で previous を追いかけて当日距離を計算
      let prevLast: number | null = null;
      const computedAsc = asc.map((rec) => {
        const currentLast = Number(rec.last_km || 0);
        let run = 0;
        if (prevLast === null) {
          // 以前の記録が無い場合は「基点無し」→現れの値をそのまま（運用に合わせて変更可）
          run = currentLast;
        } else {
          run = currentLast - prevLast;
        }
        // 更新 prevLast
        prevLast = currentLast;
        return { ...rec, computed_run_km: run };
      });

      // 表示は新しい順（降順）にする
      groups[key] = computedAsc.slice().reverse();
    });

    return groups;
  })();

  return (
    <div className="app-container">
      <div className="content" style={{ padding: "1rem" }}>
        <h2>📋 車輛日報一覧</h2>
        <div>
          <Link to="/report/new"><button>＋ 新しい日報</button></Link>{" "}
          <Link to="/"><button>TOPへ戻る</button></Link>
        </div>

        {loading ? (
          <p>読み込み中...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p>まだ日報がありません。</p>
        ) : (
          Object.entries(grouped).map(([vehicleName, list]) => (
            <div key={vehicleName} style={{ marginTop: "1.5rem" }}>
              <h3>🚙 {vehicleName}</h3>
              <table border={1} cellPadding={5} style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>運転者</th>
                    <th>現場名</th>
                    <th>移動場所</th>
                    <th>最終距離</th>
                    <th>当日距離（自動計算）</th>
                    <th>状況</th>
                    <th>不具合</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id}>
                      <td>{r.report_date}</td>
                      <td>{r.drivers?.name || "-"}</td>
                      <td>{r.site_name}</td>
                      <td>{r.location}</td>
                      <td>{r.last_km ?? "-"} km</td>
                      <td>
                        {typeof r.computed_run_km === "number" ? `${r.computed_run_km} km` : "-"}
                      </td>
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
      <Footer />
    </div>
  );
};

export default DailyReportListPage;
