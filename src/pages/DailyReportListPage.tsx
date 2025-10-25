import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// ✅ 共通サウンド再生関数
const playSound = (file: string) => {
  const audio = new Audio(file);
  audio.volume = 0.9;
  audio.play().catch((e) => console.warn("音声再生エラー:", e));
};

interface Report {
  id: string;
  report_date: string;
  site_name: string;
  location: string;
  last_km: number | null;
  status: string;
  issue_detail: string | null;
  vehicles?: { id: string; name: string };
  drivers?: { id: string; name: string };
  computed_run_km?: number;
}

const DailyReportListPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const navigate = useNavigate();

  // ✅ 日報データ取得
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

    setReports(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ 削除処理
  const handleDelete = async (id: string) => {
    if (!window.confirm("この日報を削除しますか？")) return;
    playSound("/sounds/futu.mp3");
    await supabase.from("reports").delete().eq("id", id);
    await fetchReports();
  };

  // ✅ 日付フィルター適用
  const filteredReports = reports.filter((r) => {
    if (!filterStart && !filterEnd) return true;
    const d = new Date(r.report_date);
    const start = filterStart ? new Date(filterStart) : new Date("1900-01-01");
    const end = filterEnd ? new Date(filterEnd) : new Date("9999-12-31");
    return d >= start && d <= end;
  });

  // ✅ 車両別グループ化
  const grouped = (() => {
    const groups: Record<string, Report[]> = {};
    for (const r of filteredReports) {
      const vehicleName = r.vehicles?.name || "不明車輛";
      if (!groups[vehicleName]) groups[vehicleName] = [];
      groups[vehicleName].push(r);
    }
    return groups;
  })();

  // ✅ 折りたたみトグル
  const toggleExpand = (vehicleName: string) => {
    playSound("/sounds/futu.mp3");
    setExpanded((prev) => ({ ...prev, [vehicleName]: !prev[vehicleName] }));
  };

  return (
    <div className="app-container">
      <div className="content" style={{ padding: "1rem" }}>
        <h2>📋 車輛日報一覧</h2>

        {/* フィルター */}
        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
          <label>
            開始日：
            <input
              type="date"
              value={filterStart}
              onChange={(e) => {
                playSound("/sounds/futu.mp3");
                setFilterStart(e.target.value);
              }}
            />
          </label>
          <label>
            終了日：
            <input
              type="date"
              value={filterEnd}
              onChange={(e) => {
                playSound("/sounds/futu.mp3");
                setFilterEnd(e.target.value);
              }}
            />
          </label>
        </div>

        {/* 操作ボタン */}
        <div>
          <Link
            to="/report/new"
            onClick={() => playSound("/sounds/piroriro.mp3")}
          >
            <button>＋ 新しい日報</button>
          </Link>{" "}
          <Link to="/" onClick={() => playSound("/sounds/pyororin.mp3")}>
            <button>TOPへ戻る</button>
          </Link>
        </div>

        {loading ? (
          <p>読み込み中...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p>該当する日報がありません。</p>
        ) : (
          Object.entries(grouped).map(([vehicleName, list]) => (
            <div key={vehicleName} style={{ marginTop: "1rem" }}>
              <h3
                onClick={() => toggleExpand(vehicleName)}
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  background: "#f0f0f0",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                }}
              >
                🚙 {vehicleName}{" "}
                {expanded[vehicleName] ? "▼" : "▶"}（{list.length} 件）
              </h3>

              {expanded[vehicleName] && (
                <table
                  border={1}
                  cellPadding={3}
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}
                >
                  <thead style={{ background: "#e9f3ff" }}>
                    <tr>
                      <th>日付</th>
                      <th>運転者</th>
                      <th>現場名</th>
                      <th>移動場所</th>
                      <th>最終距離</th>
                      <th>当日距離</th>
                      <th>状況</th>
                      <th>不具合</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((r) => (
                      <tr
                        key={r.id}
                        style={{
                          height: "1.8rem",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        <td>{r.report_date}</td>
                        <td>{r.drivers?.name || "-"}</td>
                        <td>{r.site_name}</td>
                        <td>{r.location}</td>
                        <td>{r.last_km ?? "-"} km</td>
                        <td>
                          {typeof r.computed_run_km === "number"
                            ? `${r.computed_run_km} km`
                            : "-"}
                        </td>
                        <td
                          style={{
                            color: r.status === "不具合" ? "red" : "black",
                          }}
                        >
                          {r.status}
                        </td>
                        <td style={{ color: "red" }}>{r.issue_detail || ""}</td>
                        <td>
                          <button
                            onClick={() => {
                              playSound("/sounds/futu.mp3");
                              navigate(`/report/edit/${r.id}`);
                            }}
                          >
                            編集
                          </button>{" "}
                          <button
                            onClick={() => {
                              playSound("/sounds/futu.mp3");
                              handleDelete(r.id);
                            }}
                            style={{
                              backgroundColor: "#ff5555",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "2px 8px",
                            }}
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DailyReportListPage;
