// src/pages/TopPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicles").select("*");
      if (!error && data) {
        setVehicles(data);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="app-container">
      <div className="content" style={{ padding: "1rem" }}>
        <h1>🚗 車輛日報</h1>
        <div style={{ marginTop: "1rem" }}>
          <Link to="/report/new"><button>日報作成</button></Link>{" "}
          <Link to="/reports"><button>日報一覧</button></Link>{" "}
          <Link to="/vehicles"><button>車輛登録</button></Link>{" "}
          <Link to="/drivers"><button>運転者登録</button></Link>
        </div>

        <div style={{ marginTop: "2rem" }}>
          {vehicles.map((v) => {
            const nextOilKm = (v.oil_change_km || 0) + 5000;
            const remain = nextOilKm - (v.last_km || 0);
            const needElement = v.element_count % 2 === 1 ? "要" : "不要";
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
                <p>
                  オイル交換まで残り{" "}
                  <span style={{ color: remain <= 500 ? "red" : "black" }}>
                    {remain} km
                  </span>
                </p>
                <p>最終距離: {v.last_km} km</p>
                <p>次回エレメント交換: {needElement}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TopPage;
