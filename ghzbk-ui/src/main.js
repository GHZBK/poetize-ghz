import { createApp } from "vue"; // Vue3 新API
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia"; // 替代 Vuex
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 引入全局自定义模块
import axios from "@/utils/request";
import { useCommon } from "./utils/common";
import constant from "./utils/constant";

// 第三方插件
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { vueBaberrage } from "vue-baberrage";

// 引入 JS
import "./utils/title";

// 引入 CSS
import "./assets/css/animation.css";
import "./assets/css/index.css";
import "./assets/css/tocbot.css";
import "./assets/css/color.css";
import "./assets/css/markdown-highlight.css";
import "./assets/css/font-awesome.min.css";

// 创建 Vue 应用
const app = createApp(App);

// 注册插件
app.use(router);
app.use(createPinia());
app.use(ElementPlus);
app.use(vueBaberrage);
app.use(mavonEditor);

// 全局挂载
app.config.globalProperties.$axios = axios;

app.config.globalProperties.$constant = constant;

// 挂载到 DOM
app.mount("#app");
