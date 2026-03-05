const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index.js",
  output: {
    publicPath: "http://localhost:3001/",
    clean: true,
  },
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
        },
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteNav",         // ⚠️ 必须与 host remotes 中 "@" 前的名称一致
      filename: "remoteEntry.js", // Host 通过这个文件发现本应用暴露的模块
      exposes: {
        // "暴露的模块别名": "实际文件路径"
        // Host 通过 import("remoteNav/Nav") 加载
        "./Nav": "./src/components/Nav",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          // Remote 端 eager 不设为 true，由 Host 统一初始化
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
  devServer: {
    port: 3001,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
};
