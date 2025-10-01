import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DriverContext } from "../context/DriverContext";

const DriverRegisterPage: React.FC = () => {
  const { drivers, addDriver, updateDriver, deleteDriver } = useContext(DriverContext)!;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      // 🔹 更新処理
      updateDriver({ id: editingId, name });
      setEditingId(null);
    } else {
      // 🔹 新規追加
      addDriver({ id: Date.now().toString(), name });
    }
    setName("");
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setName(currentName);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👨‍✈️ 運転者登録</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="運転者名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">{editingId ? "更新" : "追加"}</button>{" "}
        <button type="button" onClick={() => navigate("/")}>
          TOPへ戻る
        </button>
      </form>

      <ul style={{ marginTop: "1rem" }}>
        {drivers.map((d) => (
          <li key={d.id} style={{ marginBottom: "0.5rem" }}>
            {d.name}{" "}
            <button onClick={() => handleEdit(d.id, d.name)}>編集</button>{" "}
            <button onClick={() => deleteDriver(d.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverRegisterPage;
