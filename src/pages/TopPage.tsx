import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // useNavigate は使わなくなったため削除
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
  element_changed: boolean;
  last_run_date?: string;
}

const TopPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // message ステートはログアウト表示用だったので、不要であれば削除可能です

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

  // 📝 ログアウトボタン用の handleLogout 関数を削除しました

  return (
    <div style={{ padding: "1rem", position: "relative", minHeight: "100vh" }}>
      <h1>🚐ドラレポ</h1>

      <div style={{ marginTop: "1rem" }}>
        <Link to="/report/new" onClick={() => playSound("/sounds/futu.mp3")}>
          <button>日報作成</button>
        </Link>{" "}
        <Link to="/reports" onClick={() => playSound("/sounds/futu.mp3")}>
          <button>日報一覧</button>
        </Link>{" "}
        <p style={{ margin: "0.5rem 0 0.3rem", color: "#333" }}>
          👇オイル交換時はここで編集
        </p>
        <Link to="/vehicles" onClick={() => playSound("/sounds/futu.mp3")}>
          <button>車輛登録</button>
        </Link>{" "}
        <Link to="/drivers" onClick={() => playSound("/sounds/futu.mp3")}>
          <button>運転者登録</button>
        </Link>{" "}
        
        {/* 📝 ログアウトボタンを削除しました */}

        {/* 📝 テキストを「ログイン・アウトを省きました」に変更しました */}
        <p style={{ color: "#666", fontWeight: "bold", marginTop: "0.3rem" }}>
          ログイン・アウトを省きました
        </p>
      </div>

      {/* 車両情報 */}
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
