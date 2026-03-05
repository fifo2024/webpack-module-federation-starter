import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

// ✅ 懒加载远程组件 —— 使用 lazy + Suspense 包裹，网络失败时不崩溃
// 路径格式: "远程别名/暴露的模块名"（与 remote 的 exposes 配置对应）
const RemoteNav = lazy(() => import("remoteNav/Nav"));
const RemoteShop = lazy(() => import("remoteShop/Shop"));
const RemoteCart = lazy(() => import("remoteCart/Cart"));

// 错误边界：远程应用加载失败时展示降级 UI
class RemoteErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={styles.errorBox}>
                    <span>⚠️</span>
                    <p>
                        远程模块 <strong>{this.props.name}</strong> 加载失败
                    </p>
                    <small>{this.state.error?.message}</small>
                    <button onClick={() => this.setState({ hasError: false })}>
                        重试
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// 加载占位
const Fallback = ({ name }) => (
    <div style={styles.loading}>
        <div style={styles.spinner} />
        <span>正在加载 {name}...</span>
    </div>
);

// 包裹远程组件：ErrorBoundary + Suspense
const RemoteWrapper = ({ name, children }) => (
    <RemoteErrorBoundary name={name}>
        <Suspense fallback={<Fallback name={name} />}>{children}</Suspense>
    </RemoteErrorBoundary>
);

export default function App() {
    return (
        <BrowserRouter>
            <div style={styles.app}>
                {/* ── 顶部导航（来自 remote-nav） ── */}
                <header style={styles.header}>
                    <RemoteWrapper name="remote-nav">
                        <RemoteNav />
                    </RemoteWrapper>
                </header>

                {/* ── 主导航标签（Host 自己的路由切换） ── */}
                <nav style={styles.tabBar}>
                    {[
                        { to: "/", label: "🏠 首页" },
                        { to: "/shop", label: "🛍️ 商城" },
                        { to: "/cart", label: "🛒 购物车" },
                    ].map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            style={({ isActive }) => ({
                                ...styles.tab,
                                ...(isActive ? styles.tabActive : {}),
                            })}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* ── 路由页面 ── */}
                <main style={styles.main}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div style={styles.home}>
                                    <h1>🎯 Module Federation 微前端演示</h1>
                                    <p>
                                        本 Demo 由 4 个独立 Webpack 应用组成：
                                    </p>
                                    <ul>
                                        <li>
                                            <code>host</code> — 主应用
                                            Shell（端口 3000）
                                        </li>
                                        <li>
                                            <code>remote-nav</code> —
                                            导航栏微应用（端口 3001）
                                        </li>
                                        <li>
                                            <code>remote-shop</code> —
                                            商城微应用（端口 3002）
                                        </li>
                                        <li>
                                            <code>remote-cart</code> —
                                            购物车微应用（端口 3003）
                                        </li>
                                    </ul>
                                    <div style={styles.tip}>
                                        💡
                                        每个子应用可独立开发、独立部署，主应用运行时动态加载
                                    </div>
                                </div>
                            }
                        />
                        <Route
                            path="/shop"
                            element={
                                <RemoteWrapper name="remote-shop">
                                    <RemoteShop />
                                </RemoteWrapper>
                            }
                        />
                        <Route
                            path="/cart"
                            element={
                                <RemoteWrapper name="remote-cart">
                                    <RemoteCart />
                                </RemoteWrapper>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

const styles = {
    app: { display: "flex", flexDirection: "column", minHeight: "100vh" },
    header: { background: "#1a1a2e", color: "#fff" },
    tabBar: {
        display: "flex",
        gap: 4,
        padding: "8px 24px",
        background: "#16213e",
        borderBottom: "1px solid #0f3460",
    },
    tab: {
        padding: "8px 20px",
        borderRadius: 6,
        textDecoration: "none",
        color: "#a0aec0",
        fontWeight: 500,
        fontSize: 14,
        transition: "all .2s",
    },
    tabActive: { background: "#0f3460", color: "#e94560" },
    main: {
        flex: 1,
        padding: 24,
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
    },
    home: { padding: "40px 0" },
    loading: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 40,
        color: "#666",
        justifyContent: "center",
    },
    spinner: {
        width: 20,
        height: 20,
        border: "2px solid #e2e8f0",
        borderTop: "2px solid #4299e1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    errorBox: {
        padding: 24,
        background: "#fff5f5",
        border: "1px solid #fed7d7",
        borderRadius: 8,
        color: "#c53030",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
    },
    tip: {
        marginTop: 24,
        padding: "12px 16px",
        background: "#ebf8ff",
        border: "1px solid #bee3f8",
        borderRadius: 6,
        color: "#2b6cb0",
    },
};
