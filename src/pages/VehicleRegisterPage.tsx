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
  const [oilChangeKm, setOilChangeKm] = useState<number>(0);
  const [elementChanged, setElementChanged] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // 車両一覧を取得
  const fetchVehicles = async () => {
    const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: true });
    if (error) {
      console.error("車両取得エラー:", error);
    } else {
      setVehicles(data || []);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 保存処理（新規 or 更新）
  const handleSave = async () => {
    if (!name || !oilChangeKm) {
      setMessage("車両名とオイル交換時の距離は必須です");
      return;
    }

    if (editingId) {
      // 更新
      const { error } = await supabase
        .from("vehicles")
        .update({
          name,
          oil_change_km: oilChangeKm,
          element_changed: elementChanged,
        })
        .eq("id", editingId);

      if (error) {
        console.error("更新エラー:", error);
        setMessage("更新に失敗しました");
      } else {
        setMessage("更新しました");
        setEditingId(null);
        fetchVehicles();
      }
    } else {
      // 新規追加
      const { error } = await supabase.from("vehicles").insert([
        {
          name,
          oil_change_km: oilChangeKm,
          element_changed: elementChanged,
          last_km: 0,
        },
      ]);

      if (error) {
        console.error("追加エラー:", error);
        setMessage("保存に失敗しました");
      } else {
        setMessage("保存しました");
        fetchVehicles();
      }
    }

    // 入力欄をリセット
    setName("");
    setOilChangeKm(0);
    setElementChanged(false);
  };

  // 編集開始
  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setName(vehicle.name);
    setOilChangeKm(vehicle.oil_change_km);
    setElementChanged(vehicle.element_changed);
  };

  // 削除処理
  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;

    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      console.error("削除エラー:", error);
      setMessage("削除に失敗しました");
    } else {
      setMessage("削除しました");
      fetchVehicles();
    }
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
          オイル交換時の距離：
          <input
            type="number"
            value={oilChangeKm}
            onChange={(e) => setOilChangeKm(Number(e.target.value))}
          /> km
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          エレメント交換：
          <select value={elementChanged ? "true" : "false"} onChange={(e) => setElementChanged(e.target.value === "true")}>
            <option value="false">してない</option>
            <option value="true">した</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleSave}>{editingId ? "更新" : "保存"}</button>{" "}
        <button onClick={() => navigate("/")}>TOPへ戻る</button>
      </div>

      {message && <p>{message}</p>}

      {/* 一覧表示 */}
      <h3>登録済み車輛一覧</h3>
      {vehicles.length === 0 ? (
        <p>まだ登録がありません。</p>
      ) : (
        <table border={1} cellPadding={4} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>車輛名</th>
              <th>オイル交換距離</th>
              <th>エレメント交換</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.oil_change_km} km</td>
                <td>{v.element_changed ? "した" : "してない"}</td>
                <td>
                  <button onClick={() => handleEdit(v)}>編集</button>{" "}
                  <button onClick={() => handleDelete(v.id)}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VehicleRegisterPage;
