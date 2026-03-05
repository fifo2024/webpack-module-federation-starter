import React, { useState } from "react";

const INITIAL_ITEMS = [
  { id: 1, name: "机械键盘 Pro", price: 599,  emoji: "⌨️", qty: 1 },
  { id: 2, name: "降噪耳机",     price: 899,  emoji: "🎧", qty: 2 },
];

export default function Cart() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const update = (id, delta) =>
    setItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>🛒 购物车</h2>
        <span style={styles.source}>remote-cart · 端口 3003</span>
      </div>

      {items.length === 0 ? (
        <div style={styles.empty}>购物车是空的 🛒</div>
      ) : (
        <>
          <div style={styles.list}>
            {items.map((item) => (
              <div key={item.id} style={styles.row}>
                <span style={styles.itemEmoji}>{item.emoji}</span>
                <div style={styles.itemInfo}>
                  <span style={styles.itemName}>{item.name}</span>
                  <span style={styles.itemPrice}>¥{item.price.toLocaleString()}</span>
                </div>
                <div style={styles.qtyControl}>
                  <button style={styles.qtyBtn} onClick={() => update(item.id, -1)}>−</button>
                  <span style={styles.qty}>{item.qty}</span>
                  <button style={styles.qtyBtn} onClick={() => update(item.id, +1)}>+</button>
                </div>
                <span style={styles.subtotal}>
                  ¥{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <span>共 {items.reduce((s, i) => s + i.qty, 0)} 件</span>
            <span style={styles.total}>合计：¥{total.toLocaleString()}</span>
            <button style={styles.checkoutBtn}>去结算</button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  wrap: { padding: "8px 0", maxWidth: 600 },
  header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700 },
  source: {
    fontSize: 11, background: "#faf5ff", color: "#6b46c1",
    padding: "2px 8px", borderRadius: 10, fontFamily: "monospace",
  },
  empty: { padding: 60, textAlign: "center", color: "#a0aec0", fontSize: 18 },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  row: {
    display: "flex", alignItems: "center", gap: 14,
    background: "#fff", borderRadius: 10, padding: "14px 16px",
    boxShadow: "0 1px 4px rgba(0,0,0,.06)",
  },
  itemEmoji: { fontSize: 32 },
  itemInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 4 },
  itemName: { fontWeight: 600, fontSize: 14 },
  itemPrice: { color: "#718096", fontSize: 13 },
  qtyControl: { display: "flex", alignItems: "center", gap: 10 },
  qtyBtn: {
    width: 28, height: 28, border: "1px solid #e2e8f0",
    borderRadius: 6, background: "#f7fafc", cursor: "pointer",
    fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
  },
  qty: { width: 24, textAlign: "center", fontWeight: 700 },
  subtotal: { fontWeight: 700, fontSize: 15, color: "#e94560", minWidth: 70, textAlign: "right" },
  footer: {
    display: "flex", alignItems: "center", gap: 16, marginTop: 20,
    paddingTop: 16, borderTop: "1px solid #e2e8f0", color: "#718096",
  },
  total: { flex: 1, textAlign: "right", fontWeight: 700, fontSize: 18, color: "#2d3748" },
  checkoutBtn: {
    padding: "10px 24px", background: "#e94560", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
    cursor: "pointer",
  },
};
