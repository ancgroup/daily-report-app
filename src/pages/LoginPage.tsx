import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ 効果音再生関数
const playSound = (file: string) => {
  const audio = new Audio(file);
  audio.volume = 0.9; // 明瞭でやや大きめ
  audio.play().catch((e) => console.warn("音声再生エラー:", e));
};

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 既にログインしていたらTOPへ
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = () => {
    if (password === "ancar") {
      playSound("/sounds/dooropen.mp3"); // ✅ ログイン音
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      setError("パスワードが違います");
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "6rem" }}>
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
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        ログイン
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
