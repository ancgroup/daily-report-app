// src/pages/DriverRegisterPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

interface Driver {
  id: string;
  name: string;
}

const DriverRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [newDriver, setNewDriver] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState("");

  const fetchDrivers = async () => {
    const { data, error } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
    if (!error && data) setDrivers(data);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAdd = async () => {
    if (!newDriver) return;
    const { error } = await supabase.from("drivers").insert([{ name: newDriver }]);
    if (error) {
      setMessage("登録に失敗しました");
    } else {
      setMessage("運転者を登録しました");
      setNewDriver("");
      fetchDrivers();
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditingId(driver.id);
    setEditName(driver.name);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("drivers").update({ name: editName }).eq("id", editingId);
    if (error) {
      setMessage("更新に失敗しました");
    } else {
      setMessage("運転者を更新しました");
      setEditingId(null);
      setEditName("");
      fetchDrivers();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;
    const { error } = await supabase.from("drivers").delete().eq("id", id);
    if (error) {
      setMessage("削除に失敗しました");
    } else {
      fetchDrivers();
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>👨‍✈️ 運転者登録</h2>

      <div>
        <input
          type="text"
          placeholder="新しい運転者名"
          value={newDriver}
          onChange={(e) => setNewDriver(e.target.value)}
        />
        <button onClick={handleAdd}>追加</button>{" "}
        <button onClick={() => navigate("/")}>TOPへ戻る</button>
      </div>

      <table border={1} cellPadding={5} style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>名前</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>
                {editingId === driver.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  driver.name
                )}
              </td>
              <td>
                {editingId === driver.id ? (
                  <>
                    <button onClick={handleUpdate}>保存</button>{" "}
                    <button onClick={() => setEditingId(null)}>キャンセル</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(driver)}>編集</button>{" "}
                    <button onClick={() => handleDelete(driver.id)}>削除</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {message && <p>{message}</p>}
      <Footer />
    </div>
  );
};

export default DriverRegisterPage;
