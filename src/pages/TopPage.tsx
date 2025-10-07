// src/pages/TopPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Footer from "../components/Footer";

interface Vehicle {
  id: string;
  name: string;
  last_km: number;
  oil_change_km: number;
  element_count: number;
}

const TopPage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicles").select("*");
      if (!error && data) setVehicles(data);
    };
    fetchVehicles();
  }, []);

  const handleLogout = () => {
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
        <Link to="/report/new"><button>日報作成</button></Link>{" "}
        <Link to="/reports"><button>日報一覧</button></Link>{" "}
        <Link to="/vehicles"><button>車輛登録</button></Link>{" "}
        <Link to="/drivers"><button>運転者登録</button></Link>{" "}
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
          const needElement = v.element_count % 2 === 1 ? "要" : "不要";

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
