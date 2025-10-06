import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "ancar") {
      localStorage.setItem("auth", "true");
      navigate("/");
    } else {
      setError("パスワードが違います");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🔑 ログイン</h2>
      <input
        type="password"
        placeholder="パスワードを入力"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "1rem" }}
      />
      <br />
      <button onClick={handleLogin}>ログイン</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
