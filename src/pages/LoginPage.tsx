// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // すでにログイン済みなら自動でTOPへ
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = () => {
    if (password === "ancar") {
      localStorage.setItem("loggedIn", "true");
      navigate("/");
    } else {
      setError("パスワードが違います");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔑 ログイン</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワードを入力"
      />
      <button onClick={handleLogin}>ログイン</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
