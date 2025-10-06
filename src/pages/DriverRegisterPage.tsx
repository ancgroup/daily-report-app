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
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    const { data } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
    if (data) setDrivers(data);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSave = async () => {
    if (!name) return;
    await supabase.from("drivers").insert([{ name }]);
    setName("");
    fetchDrivers();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("削除しますか？")) return;
    await supabase.from("drivers").delete().eq("id", id);
    fetchDrivers();
  };

  const handleUpdate = async (d: Driver) => {
    await supabase.from("drivers").update({ name: d.name }).eq("id", d.id);
    fetchDrivers();
  };

  return (
    <div className="app-container">
      <div className="content" style={{ padding: "1rem" }}>
        <h2>👤 運転者登録</h2>

        <div>
          <input placeholder="運転者名" value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleSave}>保存</button>{" "}
          <button onClick={() => navigate("/")}>TOPへ戻る</button>
        </div>

        <table border={1} style={{ marginTop: "1rem", width: "100%" }}>
          <thead>
            <tr>
              <th>運転者名</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td>
                  <input value={d.name} onChange={(e) => setDrivers(drivers.map(x => x.id === d.id ? { ...x, name: e.target.value } : x))} />
                </td>
                <td>
                  <button onClick={() => handleUpdate(d)}>更新</button>{" "}
                  <button onClick={() => handleDelete(d.id)}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default DriverRegisterPage;
