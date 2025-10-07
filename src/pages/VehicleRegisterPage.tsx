// src/pages/VehicleRegisterPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Vehicle {
  id: string;
  name: string;
  oil_change_km: number;
  element_count: number;
}

const VehicleRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [name, setName] = useState("");
  const [oilKm, setOilKm] = useState<number>(0);
  const [elementChanged, setElementChanged] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchVehicles = async () => {
    const { data } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    setVehicles(data || []);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSave = async () => {
    if (!name) return;

    if (editingId) {
      await supabase
        .from("vehicles")
        .update({
          name,
          oil_change_km: oilKm,
          element_count: elementChanged ? supabase.rpc("increment_element_count", { vid: editingId }) : undefined,
        })
        .eq("id", editingId);
    } else {
      await supabase.from("vehicles").insert([
        {
          name,
          oil_change_km: oilKm,
          element_count: elementChanged ? 1 : 0,
        },
      ]);
    }

    setName("");
    setOilKm(0);
    setElementChanged(false);
    setEditingId(null);
    setMessage("保存しました");
    fetchVehicles();
  };

  const handleEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setName(v.name);
    setOilKm(v.oil_change_km);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("vehicles").delete().eq("id", id);
    fetchVehicles();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🚙 車輛登録</h2>

      <div>
        <label>
          車輛名：
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          オイル交換距離：
          <input type="number" value={oilKm} onChange={(e) => setOilKm(Number(e.target.value))} /> km
        </label>
      </div>

      <div>
        <label>
          エレメント交換：
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
      {vehicles.length === 0 ? (
        <p>登録された車輛はありません。</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>
              {v.name}（オイル交換距離: {v.oil_change_km} km / エレメント交換回数: {v.element_count}）
              <button onClick={() => handleEdit(v)}>編集</button>{" "}
              <button onClick={() => handleDelete(v.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VehicleRegisterPage;
