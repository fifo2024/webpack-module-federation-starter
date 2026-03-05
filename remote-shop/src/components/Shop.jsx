import React, { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "机械键盘 Pro", price: 599,  emoji: "⌨️", tag: "热销" },
  { id: 2, name: "4K 显示器",    price: 2499, emoji: "🖥️", tag: "新品" },
  { id: 3, name: "人体工学椅",   price: 1899, emoji: "🪑", tag: "" },
  { id: 4, name: "降噪耳机",     price: 899,  emoji: "🎧", tag: "热销" },
  { id: 5, name: "USB-C Hub",   price: 299,  emoji: "🔌", tag: "" },
  { id: 6, name: "竖屏支架",     price: 199,  emoji: "📱", tag: "折扣" },
];

export default function Shop() {
  const [cart, setCart] = useState({});

  const addToCart = (id) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>🛍️ 商城</h2>
        <span style={styles.source}>remote-shop · 端口 3002</span>
        {totalItems > 0 && (
          <span style={styles.cartBadge}>已选 {totalItems} 件</span>
        )}
      </div>

      <div style={styles.grid}>
        {PRODUCTS.map((p) => (
          <div key={p.id} style={styles.card}>
            {p.tag && <span style={styles.tag}>{p.tag}</span>}
            <div style={styles.emoji}>{p.emoji}</div>
            <h3 style={styles.name}>{p.name}</h3>
            <p style={styles.price}>¥{p.price.toLocaleString()}</p>
            <button
              style={{
                ...styles.btn,
                ...(cart[p.id] ? styles.btnActive : {}),
              }}
              onClick={() => addToCart(p.id)}
            >
              {cart[p.id] ? `已加入 (${cart[p.id]})` : "加入购物车"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: "8px 0" },
  header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700 },
  source: {
    fontSize: 11, background: "#ebf8ff", color: "#2b6cb0",
    padding: "2px 8px", borderRadius: 10, fontFamily: "monospace",
  },
  cartBadge: {
    background: "#e94560", color: "#fff", fontSize: 12,
    padding: "3px 10px", borderRadius: 10, marginLeft: "auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#fff", borderRadius: 10, padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,.06)", position: "relative",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  tag: {
    position: "absolute", top: 10, right: 10, fontSize: 10,
    background: "#fc8181", color: "#fff", padding: "2px 6px", borderRadius: 6,
  },
  emoji: { fontSize: 40, marginTop: 8 },
  name: { fontSize: 14, fontWeight: 600, textAlign: "center" },
  price: { fontSize: 18, fontWeight: 700, color: "#e94560" },
  btn: {
    width: "100%", padding: "8px 0", border: "none",
    borderRadius: 6, background: "#edf2f7", color: "#4a5568",
    cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all .2s",
  },
  btnActive: { background: "#ebf8ff", color: "#2b6cb0" },
};
