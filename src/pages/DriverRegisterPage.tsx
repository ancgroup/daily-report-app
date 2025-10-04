// src/pages/DriverRegisterPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

interface Driver {
  id: string;
  name: string;
}

const DriverRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // 運転者一覧を取得
  const fetchDrivers = async () => {
    const { data, error } = await supabase.from("drivers").select("*").order("created_at", { ascending: true });
    if (error) {
      console.error("運転者取得エラー:", error);
    } else {
      setDrivers(data || []);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // 保存処理（新規 or 更新）
  const handleSave = async () => {
    if (!name) {
      setMessage("名前を入力してください");
      return;
    }

    if (editingId) {
      // 更新
      const { error } = await supabase
        .from("drivers")
        .update({ name })
        .eq("id", editingId);

      if (error) {
        console.error("更新エラー:", error);
        setMessage("更新に失敗しました");
      } else {
        setMessage("更新しました");
        setEditingId(null);
        fetchDrivers();
      }
    } else {
      // 新規追加
      const { error } = await supabase.from("drivers").insert([{ name }]);

      if (error) {
        console.error("追加エラー:", error);
        setMessage("保存に失敗しました");
      } else {
        setMessage("保存しました");
        fetchDrivers();
      }
    }

    setName("");
  };

  // 編集開始
  const handleEdit = (driver: Driver) => {
    setEditingId(driver.id);
    setName(driver.name);
  };

  // 削除処理
  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;

    const { error } = await supabase.from("drivers").delete().eq("id", id);
    if (error) {
      console.error("削除エラー:", error);
      setMessage("削除に失敗しました");
    } else {
      setMessage("削除しました");
      fetchDrivers();
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>👤 運転者登録</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          名前：
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleSave}>{editingId ? "更新" : "保存"}</button>{" "}
        <button onClick={() => navigate("/")}>TOPへ戻る</button>
      </div>

      {message && <p>{message}</p>}

      {/* 一覧表示 */}
      <h3>登録済み運転者一覧</h3>
      {drivers.length === 0 ? (
        <p>まだ登録がありません。</p>
      ) : (
        <table border={1} cellPadding={4} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>名前</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>
                  <button onClick={() => handleEdit(d)}>編集</button>{" "}
                  <button onClick={() => handleDelete(d.id)}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverRegisterPage;
