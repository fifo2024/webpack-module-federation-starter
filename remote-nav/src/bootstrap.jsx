/**
 * 远程应用也可以独立运行（开发调试用）
 * 被 Host 加载时，bootstrap 不会执行，只有 exposes 的模块会被使用
 */
import React from "react";
import { createRoot } from "react-dom/client";
import Nav from "./components/Nav";

const root = createRoot(document.getElementById("root"));
root.render(
  <div style={{ background: "#1a1a2e" }}>
    <Nav />
    <p style={{ padding: 20, color: "#666" }}>
      ℹ️ 当前为 remote-nav 独立运行模式（端口 3001）
    </p>
  </div>
);
