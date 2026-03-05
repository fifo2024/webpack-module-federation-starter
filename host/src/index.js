/**
 * ⚠️ 关键：index.js 只做动态 import，不能直接写业务代码
 *
 * 原因：Module Federation 需要在模块执行前协商共享作用域（shared scope）。
 * 若直接 import React，webpack 会同步执行，此时共享作用域尚未初始化，
 * 远程应用就会报 "Shared module react doesn't exist in shared scope" 错误。
 *
 * 解决方案：用动态 import() 异步加载 bootstrap.jsx，
 * 给 webpack 足够时间完成共享模块协商。
 */
import("./bootstrap");
