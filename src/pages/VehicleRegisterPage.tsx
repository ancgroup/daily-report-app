// src/pages/VehicleRegisterPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

interface Vehicle {
  id: string;
  name: string;
  oil_change_km: number;
  element_changed: boolean;
}

const VehicleRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [name, setName] = useState("");
  const [oilChangeKm, setOilChangeKm] = useState("");
  const [elementChanged, setElementChanged] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchVehicles = async () => {
    const { data, error } = await supabase.from("vehicles").select("*");
    if (!error && data) setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSave = async () => {
    if (!name || !oilChangeKm) return;
    const newData = {
      name,
      oil_change_km: Number(oilChangeKm),
      element_changed: elementChanged,
    };

    if (editingId) {
      await supabase.from("vehicles").update(newData).eq("id", editingId);
    } else {
      await supabase.from("vehicles").insert([newData]);
    }
    setName("");
    setOilChangeKm("");
    setElementChanged(false);
    setEditingId(null);
    fetchVehicles();
    setMessage("保存しました");
  };

  const handleEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setName(v.name);
    setOilChangeKm(v.oil_change_km.toString());
    setElementChanged(v.element_changed);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;
    await supabase.from("vehicles").delete().eq("id", id);
    fetchVehicles();
  };

  return (
    <div style={{ padding: "1rem", position: "relative", minHeight: "100vh" }}>
      <h2>🚙 車輛登録</h2>

      <div>
        <label>
          車輛名：
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          オイル交換時距離：
          <input
            type="number"
            value={oilChangeKm}
            onChange={(e) => setOilChangeKm(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          今回エレメント交換：
          <select
            value={elementChanged ? "した" : "してない"}
            onChange={(e) => setElementChanged(e.target.value === "した")}
          >
            <option value="した">した</option>
            <option value="してない">してない</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSave}>{editingId ? "更新" : "保存"}</button>{" "}
        <button onClick={() => navigate("/")}>TOPへ戻る</button>
      </div>

      {message && <p>{message}</p>}

      <h3>登録済み車輛</h3>
      <ul>
        {vehicles.map((v) => (
          <li key={v.id}>
            {v.name}（オイル交換距離: {v.oil_change_km} km / エレメント交換:{" "}
            {v.element_changed ? "した" : "してない"}）
            <button onClick={() => handleEdit(v)}>編集</button>{" "}
            <button onClick={() => handleDelete(v.id)}>削除</button>
          </li>
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default VehicleRegisterPage;
