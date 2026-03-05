# ⚡ Webpack Module Federation 微前端完整示例

## 项目结构

```
mf-demo/
├── package.json          # Monorepo 根，用 npm workspaces 统一管理
├── host/                 # 主应用 Shell（端口 3000）
│   ├── webpack.config.js
│   ├── public/index.html
│   └── src/
│       ├── index.js      ⚠️ 只做 import("./bootstrap") 异步启动
│       ├── bootstrap.jsx # 真正的渲染入口
│       └── App.jsx       # 路由 + 懒加载远程组件 + 错误边界
├── remote-nav/           # 导航栏微应用（端口 3001）
│   ├── webpack.config.js
│   └── src/
│       ├── index.js
│       ├── bootstrap.jsx
│       └── components/Nav.jsx      → 暴露为 "remoteNav/Nav"
├── remote-shop/          # 商城微应用（端口 3002）
│   ├── webpack.config.js
│   └── src/
│       ├── index.js
│       ├── bootstrap.jsx
│       ├── hooks/useCart.js        → 暴露为 "remoteShop/useCart"
│       └── components/Shop.jsx    → 暴露为 "remoteShop/Shop"
└── remote-cart/          # 购物车微应用（端口 3003）
    ├── webpack.config.js
    └── src/
        ├── index.js
        ├── bootstrap.jsx
        └── components/Cart.jsx    → 暴露为 "remoteCart/Cart"
```

---

## 快速启动

```bash
# 1. 安装所有依赖（monorepo 一键安装）
npm install

# 2. 启动所有应用（需要 concurrently）
npm start

# 或分别启动（分 4 个终端）
cd remote-nav  && npm start   # http://localhost:3001
cd remote-shop && npm start   # http://localhost:3002
cd remote-cart && npm start   # http://localhost:3003
cd host        && npm start   # http://localhost:3000
```

> ⚠️ **远程应用需要先于主应用启动**，因为 host 要从远程地址加载 `remoteEntry.js`

---

## 核心概念详解

### 1. Module Federation Plugin 配置

#### Host（主应用）配置
```js
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    // "本地别名": "远程name@URL/remoteEntry.js"
    remoteNav: "remoteNav@http://localhost:3001/remoteEntry.js",
  },
  shared: {
    react: {
      singleton: true,   // 全局只能有一个 React 实例
      eager: true,       // ✅ Host 端设 eager，优先初始化共享作用域
    },
  },
})
```

#### Remote（子应用）配置
```js
new ModuleFederationPlugin({
  name: "remoteNav",         // ⚠️ 必须与 host remotes 中 "@" 前名称一致
  filename: "remoteEntry.js", // Host 通过这个文件发现暴露的模块
  exposes: {
    "./Nav": "./src/components/Nav",  // 暴露组件
  },
  shared: {
    react: {
      singleton: true,
      // Remote 端不设 eager，由 Host 初始化
    },
  },
})
```

---

### 2. 异步 Bootstrap 模式（解决 "shared module doesn't exist" 报错）

```
❌ 错误方式（index.js 直接写业务代码）:
   import React from "react"   ← webpack 同步执行，共享作用域尚未就绪
   import App from "./App"
   ReactDOM.render(...)

✅ 正确方式（index.js 只做动态 import）:
   import("./bootstrap")       ← 异步，给 webpack 时间协商共享模块
```

---

### 3. 远程组件加载方式

```jsx
// 方式一：React.lazy（推荐，自动代码分割）
const RemoteNav = lazy(() => import("remoteNav/Nav"));

// 方式二：动态 import（手动控制）
const [Component, setComponent] = useState(null);
useEffect(() => {
  import("remoteNav/Nav").then(m => setComponent(() => m.default));
}, []);
```

---

### 4. 错误边界（必须有！）

远程应用可能因网络、版本不兼容等原因加载失败。
必须用 `ErrorBoundary` 包裹所有远程组件，防止整个主应用崩溃：

```jsx
<RemoteErrorBoundary name="remote-nav">
  <Suspense fallback={<Loading />}>
    <RemoteNav />
  </Suspense>
</RemoteErrorBoundary>
```

---

### 5. 共享模块策略

| 场景 | 配置 |
|------|------|
| React / React-DOM | `singleton: true, eager: true`（Host 端） |
| 状态管理库（Zustand/Redux） | `singleton: true`（共享一个 store 实例） |
| 工具库（lodash/dayjs） | 不设 singleton，各应用可用不同版本 |
| 业务组件库 | `singleton: false`（允许版本独立） |

---

## 进阶：跨应用通信方案

### 方案一：CustomEvent（最简单）
```js
// 发送方（remote-shop）
window.dispatchEvent(new CustomEvent("cart:add", { detail: { product } }));

// 接收方（host / remote-cart）
window.addEventListener("cart:add", (e) => console.log(e.detail));
```

### 方案二：共享 Store（通过 MF 暴露）
```js
// remote-shop 暴露全局 store
exposes: { "./store": "./src/store/cartStore" }

// host / remote-cart 直接 import 同一个 store 实例
import store from "remoteShop/store";
```

### 方案三：URL / Query Params
适合路由级别的状态传递，刷新后仍保留。

---

## 生产环境部署注意事项

1. **publicPath 必须是绝对路径**
   ```js
   output: { publicPath: "https://cdn.example.com/remote-nav/" }
   ```

2. **远程应用需设置 CORS**（Nginx 示例）
   ```nginx
   add_header Access-Control-Allow-Origin *;
   ```

3. **版本管理**：建议给 `remoteEntry.js` 加版本号或时间戳，避免缓存问题
   ```js
   filename: "remoteEntry.[contenthash].js"
   ```

4. **动态远程地址**（运行时切换环境）
   ```js
   // 不在 webpack 配置写死，改为运行时动态加载
   async function loadRemote(url, scope, module) {
     await __webpack_init_sharing__("default");
     const container = await loadScript(url); // 动态加载 remoteEntry.js
     await container.init(__webpack_share_scopes__.default);
     const factory = await container.get(module);
     return factory();
   }
   ```
