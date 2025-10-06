// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FIXED_PASSWORD = "ancar"; // 固定パスワード

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // すでにログイン済みならTOPへ飛ばす
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/top");
    }
  }, [navigate]);

  const handleLogin = () => {
    if (password === FIXED_PASSWORD) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/top");
    } else {
      setError("パスワードが間違っています");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>🔑 ログイン</h2>
      <input
        type="password"
        placeholder="パスワードを入力"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "1rem 0", padding: "0.5rem", width: "200px" }}
      />
      <button onClick={handleLogin} style={{ padding: "0.5rem 1rem" }}>
        ログイン
      </button>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
