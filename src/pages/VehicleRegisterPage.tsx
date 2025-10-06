// src/pages/VehicleRegisterPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

interface Vehicle {
  id: string;
  name: string;
  last_km: number;
  oil_change_km: number;
  element_count: number;
}

const VehicleRegisterPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [name, setName] = useState("");
  const [lastKm, setLastKm] = useState<number>(0);
  const [oilKm, setOilKm] = useState<number>(0);
  const [elementCount, setElementCount] = useState<number>(0);
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    const { data } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    if (data) setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSave = async () => {
    if (!name) return;
    await supabase.from("vehicles").insert([{ name, last_km: lastKm, oil_change_km: oilKm, element_count: elementCount }]);
    setName("");
    setLastKm(0);
    setOilKm(0);
    setElementCount(0);
    fetchVehicles();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;
    await supabase.from("vehicles").delete().eq("id", id);
    fetchVehicles();
  };

  const handleUpdate = async (v: Vehicle) => {
    await supabase.from("vehicles").update({
      name: v.name,
      last_km: v.last_km,
      oil_change_km: v.oil_change_km,
      element_count: v.element_count,
    }).eq("id", v.id);
    fetchVehicles();
  };

  return (
    <div className="app-container">
      <div className="content" style={{ padding: "1rem" }}>
        <h2>🚙 車輛登録</h2>

        <div>
          <input placeholder="車両名" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" placeholder="最終距離" value={lastKm} onChange={(e) => setLastKm(Number(e.target.value))} />
          <input type="number" placeholder="オイル交換距離" value={oilKm} onChange={(e) => setOilKm(Number(e.target.value))} />
          <input type="number" placeholder="エレメント交換回数" value={elementCount} onChange={(e) => setElementCount(Number(e.target.value))} />
          <button onClick={handleSave}>保存</button>{" "}
          <button onClick={() => navigate("/")}>TOPへ戻る</button>
        </div>

        <table border={1} style={{ marginTop: "1rem", width: "100%" }}>
          <thead>
            <tr>
              <th>車輛名</th>
              <th>最終距離</th>
              <th>オイル交換距離</th>
              <th>エレメント交換回数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td><input value={v.name} onChange={(e) => setVehicles(vehicles.map(x => x.id === v.id ? { ...x, name: e.target.value } : x))} /></td>
                <td><input type="number" value={v.last_km} onChange={(e) => setVehicles(vehicles.map(x => x.id === v.id ? { ...x, last_km: Number(e.target.value) } : x))} /></td>
                <td><input type="number" value={v.oil_change_km} onChange={(e) => setVehicles(vehicles.map(x => x.id === v.id ? { ...x, oil_change_km: Number(e.target.value) } : x))} /></td>
                <td><input type="number" value={v.element_count} onChange={(e) => setVehicles(vehicles.map(x => x.id === v.id ? { ...x, element_count: Number(e.target.value) } : x))} /></td>
                <td>
                  <button onClick={() => handleUpdate(v)}>更新</button>{" "}
                  <button onClick={() => handleDelete(v.id)}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleRegisterPage;
