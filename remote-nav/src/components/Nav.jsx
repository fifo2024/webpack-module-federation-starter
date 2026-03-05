import React, { useState } from "react";

export default function Nav() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // 每秒更新时间，证明组件有真实状态
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>⚡</span>
        <span style={styles.brandName}>MicroFront</span>
        <span style={styles.badge}>remote-nav · :3001</span>
      </div>

      <div style={styles.right}>
        <span style={styles.clock}>🕐 {time}</span>
        <span style={styles.avatar}>👤 用户</span>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 24px", background: "linear-gradient(135deg,#1a1a2e,#16213e)",
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  logo: { fontSize: 22 },
  brandName: { fontSize: 18, fontWeight: 700, color: "#e2e8f0", letterSpacing: 1 },
  badge: {
    fontSize: 10, background: "#e94560", color: "#fff",
    padding: "2px 7px", borderRadius: 10, fontFamily: "monospace",
  },
  right: { display: "flex", alignItems: "center", gap: 20 },
  clock: { color: "#a0aec0", fontSize: 13, fontFamily: "monospace" },
  avatar: {
    background: "#0f3460", color: "#e2e8f0", padding: "6px 14px",
    borderRadius: 20, fontSize: 13, cursor: "pointer",
  },
};
