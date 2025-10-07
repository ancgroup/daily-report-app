// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "ancar") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      setError("パスワードが違います");
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "5rem" }}>
      <h2>🔐 ログイン</h2>
      <input
        type="password"
        placeholder="パスワードを入力"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "0.5rem", width: "200px" }}
      />
      <br />
      <button
        onClick={handleLogin}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        ログイン
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
