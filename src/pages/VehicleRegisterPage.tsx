// src/pages/VehicleRegisterPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  id: string;
  name: string;
  oil_change_km: number;
  element_changed: boolean;
  last_km: number;
}

const VehicleRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [name, setName] = useState("");
  const [oilChangeKm, setOilChangeKm] = useState("");
  const [elementChanged, setElementChanged] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // 車両一覧取得
  const fetchVehicles = async () => {
    const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("車両一覧取得エラー:", error);
      setMessage("車両データの取得に失敗しました");
    } else {
      setVehicles(data || []);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 保存処理
  const handleSaveVehicle = async () => {
    if (!name || !oilChangeKm) {
      setMessage("車両名とオイル交換距離を入力してください");
      return;
    }

    const vehicleData = {
      name,
      oil_change_km: Number(oilChangeKm),
      element_changed: elementChanged,
    };

    if (editingId) {
      const { error } = await supabase.from("vehicles").update(vehicleData).eq("id", editingId);
      if (error) {
        console.error("車両更新エラー:", error);
        setMessage("更新に失敗しました");
      } else {
        setMessage("更新しました");
        setEditingId(null);
        fetchVehicles();
      }
    } else {
      const { error } = await supabase.from("vehicles").insert([{ ...vehicleData, last_km: 0 }]);
      if (error) {
        console.error("車両追加エラー:", error);
        setMessage("保存に失敗しました");
      } else {
        setMessage("保存しました");
        fetchVehicles();
      }
    }

    setName("");
    setOilChangeKm("");
    setElementChanged(false);
  };

  // 削除処理
  const handleDeleteVehicle = async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      console.error("削除エラー:", error);
      setMessage("削除に失敗しました");
    } else {
      setMessage("削除しました");
      fetchVehicles();
    }
  };

  // 編集処理
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setName(vehicle.name);
    setOilChangeKm(String(vehicle.oil_change_km));
    setElementChanged(vehicle.element_changed);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🚙 車輛登録</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          車輛名：
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          オイル交換距離：
          <input type="number" value={oilChangeKm} onChange={(e) => setOilChangeKm(e.target.value)} /> km
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          前回エレメント交換：
          <select value={elementChanged ? "した" : "してない"} onChange={(e) => setElementChanged(e.target.value === "した")}>
            <option value="した">した</option>
            <option value="してない">してない</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleSaveVehicle}>{editingId ? "更新" : "保存"}</button>{" "}
        <button onClick={() => navigate("/")}>TOPへ戻る</button>
      </div>

      {message && <p>{message}</p>}

      <h3>登録済み車輛一覧</h3>
      {vehicles.length === 0 ? (
        <p>まだ車輛が登録されていません。</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>
              {v.name}（オイル交換距離: {v.oil_change_km} km / エレメント交換:{" "}
              {v.element_changed ? "した" : "してない"} / 最終距離: {v.last_km ?? 0} km）
              <button onClick={() => handleEditVehicle(v)}>編集</button>{" "}
              <button onClick={() => handleDeleteVehicle(v.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VehicleRegisterPage;
