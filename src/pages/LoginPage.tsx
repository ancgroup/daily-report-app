import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "ancar") {
      localStorage.setItem("authenticated", "true"); // ✅ ログイン状態を保存
      navigate("/"); // TOPページへ移動
    } else {
      alert("パスワードが違います");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🔑 ログイン</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="パスワードを入力"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default LoginPage;
