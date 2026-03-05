const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:3000/",
        clean: true,
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "host", // 本应用名称（唯一标识）
            remotes: {
                // 格式: "本地别名": "远程应用name@远程地址/remoteEntry.js"
                remoteNav: "remoteNav@http://localhost:3001/remoteEntry.js",
                remoteShop: "remoteShop@http://localhost:3002/remoteEntry.js",
                remoteCart: "remoteCart@http://localhost:3003/remoteEntry.js",
            },
            shared: {
                // 共享依赖 - 避免多份 React 实例导致的 hook 报错
                react: {
                    singleton: true, // 全局只允许一个实例
                    requiredVersion: deps.react,
                    eager: true, // Host 端 eager=true，优先初始化共享作用域
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                    eager: true,
                },
                "react-router-dom": {
                    singleton: true,
                    requiredVersion: deps["react-router-dom"],
                    eager: true,
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
    devServer: {
        port: 3000,
        historyApiFallback: true, // SPA 路由支持
        headers: {
            // 允许跨域加载远程模块（开发环境必须）
            "Access-Control-Allow-Origin": "*",
        },
    },
};
