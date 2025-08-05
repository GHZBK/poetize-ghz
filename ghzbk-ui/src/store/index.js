// 📦 引入 Pinia 的 defineStore 方法（用于定义一个新的 Store）
import { defineStore } from "pinia";
// 🪝 引入 Vue 的 reactive 和 computed
import { reactive, computed, toRefs } from "vue";

// 🌟 定义并导出一个名为 useMainStore 的 Store
export const useMainStore = defineStore("mainStore", () => {
  /**
   * 🌱 state: 用 reactive 定义响应式数据
   * 相当于 Vuex 的 state
   * 注意：这里所有数据都是响应式的，可以在组件中直接修改
   */
  const state = reactive({
    // 工具栏状态（从 localStorage 读取，默认值：visible=false, enter=true）
    toolbar: JSON.parse(
      localStorage.getItem("toolbar") || '{"visible": false, "enter": true}'
    ),
    // 分类信息（数组）
    sortInfo: JSON.parse(localStorage.getItem("sortInfo") || "[]"),
    // 当前登录用户信息（对象）
    currentUser: JSON.parse(localStorage.getItem("currentUser") || "{}"),
    // 当前登录管理员信息（对象）
    currentAdmin: JSON.parse(localStorage.getItem("currentAdmin") || "{}"),
    // 系统配置（对象）
    sysConfig: JSON.parse(localStorage.getItem("sysConfig") || "{}"),
    // 网站信息（对象）
    webInfo: JSON.parse(
      localStorage.getItem("webInfo") ||
        '{"webName": "", "webTitle": [], "notices": [], "randomCover": [], "footer": "", "backgroundImage": "", "avatar": ""}'
    ),
  });

  /**
   * 🎯 getters: 相当于 Vuex 的 getters
   * 使用 computed 包装，定义计算属性
   */

  // 文章总数（统计所有 sortInfo 的 countOfSort）
  const articleTotal = computed(() => {
    if (state.sortInfo && state.sortInfo.length !== 0) {
      if (state.sortInfo.length === 1) {
        return state.sortInfo[0].countOfSort;
      } else {
        return state.sortInfo.reduce((prev, curr) => {
          if (typeof prev === "number") {
            return prev + curr.countOfSort;
          } else {
            return prev.countOfSort + curr.countOfSort;
          }
        });
      }
    } else {
      return 0;
    }
  });

  // 导航栏数据（过滤 sortInfo，返回 sortType === 0 的分类）
  const navigationBar = computed(() => {
    if (state.sortInfo && state.sortInfo.length !== 0) {
      return state.sortInfo.filter((f) => f.sortType === 0);
    } else {
      return [];
    }
  });

  /**
   * 🔥 actions: 相当于 Vuex 的 mutations 和 actions
   * 这里用函数定义，可以同步或异步
   */

  // 更新工具栏状态
  function changeToolbarStatus(toolbarState) {
    state.toolbar = toolbarState;
    localStorage.setItem("toolbar", JSON.stringify(toolbarState));
  }

  // 加载分类信息
  function loadSortInfo(sortInfo) {
    if (sortInfo && sortInfo.length !== 0) {
      // 按 priority 排序
      state.sortInfo = sortInfo.sort((s1, s2) => s1.priority - s2.priority);
      localStorage.setItem("sortInfo", JSON.stringify(state.sortInfo));
    }
  }

  // 加载当前用户信息
  function loadCurrentUser(user) {
    state.currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  // 加载系统配置
  function loadSysConfig(sysConfig) {
    state.sysConfig = sysConfig;
    localStorage.setItem("sysConfig", JSON.stringify(sysConfig));
  }

  // 加载当前管理员信息
  function loadCurrentAdmin(user) {
    state.currentAdmin = user;
    localStorage.setItem("currentAdmin", JSON.stringify(user));
  }

  // 加载网站信息
  function loadWebInfo(webInfo) {
    // webTitle 转数组
    webInfo.webTitle = webInfo.webTitle.split("");
    // notices 和 randomCover 解析 JSON
    try {
      if (typeof webInfo.notices === "string") {
        webInfo.notices = JSON.parse(webInfo.notices);
      }
      if (typeof webInfo.randomCover === "string") {
        webInfo.randomCover = JSON.parse(webInfo.randomCover);
      }
    } catch (e) {
      console.error("解析 webInfo 出错:", e);
    }
    // 更新状态
    state.webInfo = webInfo;
    console.log("加载到：", webInfo);
    localStorage.setItem("webInfo", JSON.stringify(webInfo));
  }

  // 🚀 返回 state、getters 和 actions
  return {
    ...toRefs(state), // 响应式数据
    articleTotal, // 计算属性：文章总数
    navigationBar, // 计算属性：导航栏数据
    changeToolbarStatus, // 更新工具栏
    loadSortInfo, // 加载分类
    loadCurrentUser, // 加载用户
    loadSysConfig, // 加载配置
    loadCurrentAdmin, // 加载管理员
    loadWebInfo, // 加载网站信息
  };
});
