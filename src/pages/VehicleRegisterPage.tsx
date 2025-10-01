import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VehicleContext } from "../context/VehicleContext";

const VehicleRegisterPage: React.FC = () => {
  const { vehicles, setVehicles } = useContext(VehicleContext)!;
  const [name, setName] = useState("");
  const [oilChangeOdometer, setOilChangeOdometer] = useState("");
  const [elementChanged, setElementChanged] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // 車両保存（追加 or 更新）
  const handleSaveVehicle = () => {
    if (!name || !oilChangeOdometer) return;

    if (editingId) {
      // 編集モード → 更新
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? {
                ...v,
                name,
                oilChangeOdometer: Number(oilChangeOdometer),
                elementChanged,
              }
            : v
        )
      );
      setEditingId(null);
    } else {
      // 新規追加
      const newVehicle = {
        id: Date.now().toString(),
        name,
        oilChangeOdometer: Number(oilChangeOdometer),
        elementChanged,
        finalOdometer: 0,
      };
      setVehicles((prev) => [...prev, newVehicle]);
    }

    // 入力欄をクリア
    setName("");
    setOilChangeOdometer("");
    setElementChanged(false);
  };

  // 車両削除
  const handleDeleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // 編集開始
  const handleEditVehicle = (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    if (!target) return;

    setEditingId(id);
    setName(target.name);
    setOilChangeOdometer(String(target.oilChangeOdometer));
    setElementChanged(target.elementChanged);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🚙 車両登録</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          車両名：
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          オイル交換走行距離：
          <input
            type="number"
            value={oilChangeOdometer}
            onChange={(e) => setOilChangeOdometer(e.target.value)}
          />{" "}
          km
        </label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          前回エレメント交換：
          <select
            value={elementChanged ? "した" : "してない"}
            onChange={(e) => setElementChanged(e.target.value === "した")}
          >
            <option value="した">した</option>
            <option value="してない">してない</option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleSaveVehicle}>
          {editingId ? "更新" : "保存"}
        </button>{" "}
        <button onClick={() => navigate("/")}>TOPへ戻る</button>
      </div>

      {/* 車両一覧 */}
      <h3>登録済み車両一覧</h3>
      {vehicles.length === 0 ? (
        <p>まだ車両が登録されていません。</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>
              {v.name}（オイル交換距離: {v.oilChangeOdometer} km / エレメント交換:{" "}
              {v.elementChanged ? "した" : "してない"}）
              <button onClick={() => handleEditVehicle(v.id)}>編集</button>{" "}
              <button onClick={() => handleDeleteVehicle(v.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VehicleRegisterPage;
