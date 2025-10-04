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

  // 運転者一覧取得
  const fetchDrivers = async () => {
    const { data, error } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("運転者一覧取得エラー:", error);
      setMessage("運転者データの取得に失敗しました");
    } else {
      setDrivers(data || []);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // 保存処理
  const handleSaveDriver = async () => {
    if (!name) {
      setMessage("運転者名を入力してください");
      return;
    }

    if (editingId) {
      const { error } = await supabase.from("drivers").update({ name }).eq("id", editingId);
      if (error) {
        console.error("運転者更新エラー:", error);
        setMessage("更新に失敗しました");
      } else {
        setMessage("更新しました");
        setEditingId(null);
        fetchDrivers();
      }
    } else {
      const { error } = await supabase.from("drivers").insert([{ name }]);
      if (error) {
        console.error("運転者追加エラー:", error);
        setMessage("保存に失敗しました");
      } else {
        setMessage("保存しました");
        fetchDrivers();
      }
    }

    setName("");
  };

  // 削除処理
  const handleDeleteDriver = async (id: string) => {
    const { error } = await supabase.from("drivers").delete().eq("id", id);
    if (error) {
      console.error("削除エラー:", error);
      setMessage("削除に失敗しました");
    } else {
      setMessage("削除しました");
      fetchDrivers();
    }
  };

  // 編集処理
  const handleEditDriver = (driver: Driver) => {
    setEditingId(driver.id);
    setName(driver.name);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>👤 運転者登録</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          運転者名：
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleSaveDriver}>{editingId ? "更新" : "保存"}</button>{" "}
        <button onClick={() => navigate("/")}>TOPへ戻る</button>
      </div>

      {message && <p>{message}</p>}

      <h3>登録済み運転者一覧</h3>
      {drivers.length === 0 ? (
        <p>まだ運転者が登録されていません。</p>
      ) : (
        <ul>
          {drivers.map((d) => (
            <li key={d.id}>
              {d.name}
              <button onClick={() => handleEditDriver(d)}>編集</button>{" "}
              <button onClick={() => handleDeleteDriver(d.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverRegisterPage;
