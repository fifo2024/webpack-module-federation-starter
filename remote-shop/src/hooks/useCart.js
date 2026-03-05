import { useState, useCallback } from "react";

// 这个 hook 可以通过 MF 暴露给其他微应用使用
// import useCart from "remoteShop/useCart"
export default function useCart() {
  const [cart, setCart] = useState([]);

  const addItem = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      return existing
        ? prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return { cart, addItem, removeItem, total };
}
