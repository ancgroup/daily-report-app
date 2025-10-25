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

  // --- 車両一覧を取得 ---
  const fetchVehicles = async () => {
    const { data, error } = await supabase.from("vehicles").select("*");
    if (error) {
      console.error("取得エラー:", error.message);
      return;
    }
    if (data) setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // --- 保存 or 更新 ---
  const handleSave = async () => {
    if (!name || !oilChangeKm) {
      alert("車輛名とオイル交換距離を入力してください。");
      return;
    }

    const newData = {
      name,
      oil_change_km: Number(oilChangeKm),
      element_changed: elementChanged, // ← ここが今回の入力で上書き
    };

    let result;
    if (editingId) {
      result = await supabase
        .from("vehicles")
        .update(newData)
        .eq("id", editingId)
        .select(); // ← 更新後のデータを取得
    } else {
      result = await supabase.from("vehicles").insert([newData]).select();
    }

    if (result.error) {
      console.error("保存エラー:", result.error.message);
      setMessage("保存に失敗しました");
      return;
    }

    // 更新結果を即反映
    fetchVehicles();
    setName("");
    setOilChangeKm("");
    setElementChanged(false);
    setEditingId(null);
    setMessage("保存しました");
  };

  // --- 編集時のデータ読み込み ---
  const handleEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setName(v.name);
    setOilChangeKm(v.oil_change_km.toString());
    setElementChanged(v.element_changed);
  };

  // --- 削除 ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      console.error("削除エラー:", error.message);
      return;
    }
    fetchVehicles();
  };

  return (
    <div style={{ padding: "1rem", position: "relative", minHeight: "100vh" }}>
      <h2>🚙 車輛登録</h2>

      <div>
        <label>
          車輛名：
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div>
        <label>
          オイル交換時距離：
          <input
            type="number"
            value={oilChangeKm}
            onChange={(e) => setOilChangeKm(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div>
        <label>
          今回エレメント交換：
          <select
            value={elementChanged ? "した" : "してない"}
            onChange={(e) => setElementChanged(e.target.value === "した")}
            style={{ marginLeft: "0.5rem" }}
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

      {message && <p style={{ color: "green" }}>{message}</p>}

      <h3>登録済み車輛</h3>
      <ul>
        {vehicles.map((v) => (
          <li key={v.id}>
            {v.name}（オイル交換距離: {v.oil_change_km} km / 今回エレメント交換:{" "}
            {v.element_changed ? "した" : "してない"} / 次回エレメント交換:{" "}
            {v.element_changed ? "不要" : "要"}）
            <button
              onClick={() => handleEdit(v)}
              style={{ marginLeft: "0.5rem" }}
            >
              編集
            </button>
            <button
              onClick={() => handleDelete(v.id)}
              style={{ marginLeft: "0.5rem" }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default VehicleRegisterPage;
