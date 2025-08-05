// 引入 Vite 的配置函数 defineConfig，可以获得类型提示和更好的代码补全
import { defineConfig } from "vite";

// 引入 Vue 插件，让 Vite 能处理 .vue 文件
import vue from "@vitejs/plugin-vue";

// 引入 Gzip 压缩插件，用于构建时压缩 JS/CSS/HTML 生成 .gz 文件
import viteCompression from "vite-plugin-compression";

// 引入按需加载插件，用于自动导入 Vue 组件（Element Plus、其他 UI 库）
import Components from "unplugin-vue-components/vite";

// Element Plus 的解析器，让按需加载支持 Element Plus 组件和样式
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import path from "path";

import { fileURLToPath, URL } from "url";

// 导出 Vite 配置
export default defineConfig({
  plugins: [
    // 启用 Vue 插件，支持解析 .vue 文件
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),

    // 启用 Gzip 压缩
    viteCompression({
      // 压缩算法，这里使用 gzip
      algorithm: "gzip",
      // 只压缩大于 10KB 的文件（单位：字节）
      threshold: 10240,
      // 是否删除原始文件（false = 保留原始文件和压缩后的 .gz）
      deleteOriginFile: false,
    }),

    // 启用按需加载插件
    Components({
      // 配置解析器，支持 Element Plus 自动导入
      resolvers: [ElementPlusResolver()],
      // ↓ 可选：默认会自动引入所有组件
      // 也可以配置dirs参数指定自动导入目录
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variable.scss"; @import "./src/styles/reset.scss";`, // 此处全局的scss文件
      },
    },
  },

  // 开发服务器配置
  server: {
    // 本地开发端口（http://localhost:80）
    port: 80,
    // 启动后是否自动打开浏览器（false = 不自动打开）
    open: true,
    historyApiFallback: true,
  },

  // 构建配置
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1500, // 当 chunk 超过 1.5MB 提醒
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("element-plus")) return "element-plus";
            return "vendor";
          }
        },
      },
    },
  },
});
