// src/pages/TopPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const TopPage: React.FC = () => {
  const navigate = useNavigate();

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // ログイン状態を削除
    navigate("/"); // ログイン画面へ戻す
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🚗 車輛日報</h1>
      <div style={{ marginTop: "1rem" }}>
        <Link to="/report/new">
          <button>日報作成</button>
        </Link>{" "}
        <Link to="/reports">
          <button>日報一覧</button>
        </Link>{" "}
        <Link to="/vehicles">
          <button>車輛登録</button>
        </Link>{" "}
        <Link to="/drivers">
          <button>運転者登録</button>
        </Link>{" "}
        <button
          onClick={handleLogout}
          style={{ marginLeft: "1rem", color: "red" }}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default TopPage;
