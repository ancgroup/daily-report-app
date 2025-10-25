import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Footer from "../components/Footer";

// ✅ 共通サウンド再生関数
const playSound = (file: string) => {
  const audio = new Audio(file);
  audio.volume = 0.9;
  audio.play().catch((e) => console.warn("音声再生エラー:", e));
};

interface Vehicle {
  id: string;
  name: string;
  last_km: number;
  oil_change_km: number;
  element_changed: boolean; // ← 修正（typo修正）
  last_run_date?: string; // 最終走行日
}

const TopPage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data: vehicleData, error } = await supabase.from("vehicles").select("*");
      if (error || !vehicleData) return;

      const vehicleIds = vehicleData.map((v) => v.id);

      const { data: reportData } = await supabase
        .from("reports")
        .select("vehicle_id, report_date")
        .in("vehicle_id", vehicleIds)
        .order("report_date", { ascending: false });

      const latestDates: Record<string, string> = {};
      reportData?.forEach((r) => {
        if (!latestDates[r.vehicle_id]) {
          latestDates[r.vehicle_id] = r.report_date;
        }
      });

      const merged = vehicleData.map((v) => ({
        ...v,
        last_run_date: latestDates[v.id] || "未記録",
      }));

      setVehicles(merged);
    };
    fetchVehicles();
  }, []);

  // ✅ ログアウト時の音再生
  const handleLogout = () => {
    playSound("/sounds/doorclose.mp3"); // ログアウト音
    localStorage.removeItem("isLoggedIn");
    setMessage("ログアウトしました");
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div style={{ padding: "1rem", position: "relative", minHeight: "100vh" }}>
      <h1>🚗 車輛日報</h1>

      <div style={{ marginTop: "1rem" }}>
        <Link
          to="/report/new"
          onClick={() => playSound("/sounds/futu.mp3")}
        >
          <button>日報作成</button>
        </Link>{" "}
        <Link
          to="/reports"
          onClick={() => playSound("/sounds/futu.mp3")}
        >
          <button>日報一覧</button>
        </Link>{" "}
        <Link
          to="/vehicles"
          onClick={() => playSound("/sounds/futu.mp3")}
        >
          <button>車輛登録</button>
        </Link>{" "}
        <Link
          to="/drivers"
          onClick={() => playSound("/sounds/futu.mp3")}
        >
          <button>運転者登録</button>
        </Link>{" "}
        <button
          onClick={handleLogout}
          style={{ backgroundColor: "#f55", color: "white" }}
        >
          ログアウト
        </button>
      </div>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* 車両情報カード */}
      <div style={{ marginTop: "2rem", paddingBottom: "5rem" }}>
        {vehicles.map((v) => {
          const nextOilKm = (v.oil_change_km || 0) + 5000;
          const remain = nextOilKm - (v.last_km || 0);
          const needElement = v.element_changed ? "不要" : "要";

          const oilMessage =
            remain <= 100
              ? `⚠ オイル交換時期です（残り ${remain} km）`
              : `オイル交換まで残り ${remain} km`;

          return (
            <div
              key={v.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3>🚙 {v.name}</h3>
              <p
                style={{
                  color: remain <= 100 ? "red" : remain <= 500 ? "orange" : "black",
                  fontWeight: remain <= 100 ? "bold" : "normal",
                }}
              >
                {oilMessage}
              </p>
              <p>最終距離: {v.last_km} km</p>
              <p>📅 最終走行日: {v.last_run_date}</p>
              <p>次回エレメント交換: {needElement}</p>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default TopPage;
