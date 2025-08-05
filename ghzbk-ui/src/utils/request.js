// 📦 引入 axios（HTTP 请求库）
import axios from "axios";

// 📦 引入常量配置
import constant from "@/utils/constant.js";

// 📦 引入 qs（处理 URL 参数序列化）
import qs from "qs";

// 📦 引入 Pinia 的 Store（注意：不是 Vuex 的 store 了）
import { useMainStore } from "@/store";

import { ElMessage } from "element-plus";

// 定义接口延迟时间和最大重试次数
const RETRY_DELAY = 1000;
const RETRY_COUNT = 0;

// 使用Element Plus的Loading服务创建全局加载层的实例，用于请求时显示加载状态
// let loadingInstance: LoadingInstance

// 创建axios实例
const request = axios.create({
  baseURL: constant.baseURL, // 基础URL
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 是否携带cookie信息
  headers: {
    "Content-Type": "application/json", // 默认使用JSON格式进行数据传输
  },
});

/**
 * 📦 请求拦截器
 * 作用：请求发送前统一处理（如：加上 Authorization 头部等）
 */
request.interceptors.request.use(
  function (config) {
    const store = useMainStore();

    // ✅ 自动判断 userToken 和 adminToken
    const tokenKey = config.isAdmin ? "adminToken" : "userToken";
    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers.Authorization = token;
    }

    // ✅ 自动处理 JSON 或 Form 格式
    if (config.isForm) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      if (config.data) {
        config.data = qs.stringify(config.data);
      }
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // ✅ 如果是 GET 请求，将 params 转 query 参数
    if (config.method === "get" && config.params) {
      config.url +=
        "?" + qs.stringify(config.params, { arrayFormat: "brackets" });
      delete config.params;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * 📦 响应拦截器
 * 作用：所有响应统一处理
 */
request.interceptors.response.use(
  function (response) {
    const store = useMainStore();

    // 🔥 检查响应数据
    if (
      response.data !== null &&
      response.data.hasOwnProperty("code") &&
      response.data.code !== 200
    ) {
      // 👮‍♂️ 如果 code === 300 表示需要重新登录
      if (response.data.code === 300) {
        store.loadCurrentUser({}); // 清空当前用户
        localStorage.removeItem("userToken");

        store.loadCurrentAdmin({}); // 清空管理员信息
        localStorage.removeItem("adminToken");

        // 跳转到登录页
        window.location.href = constant.webURL + "/user";
      }

      // ❌ 返回错误提示
      return Promise.reject(new Error(response.data.message));
    } else {
      // ✅ 正常返回响应
      return response.data;
    }
  },
  function (error) {
    // 🚨 响应错误统一处理
    // 处理超时、网络错误等情况
    if (axios.isCancel(error)) {
      console.log("请求已取消", error.message);
    } else if (!error.response) {
      // 处理断网的情况
      ElMessage.error("请检查网络连接是否正常 或 服务端未正常运行");
    }

    // 实现axios请求的自动重发
    const config = error.config;
    if (!config || !config.retry) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= config.retry) {
      // 如果重试次数达到设定的限制，则抛出错误信息
      return Promise.reject(error);
    }

    config.__retryCount += 1;

    // 延迟处理
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1);
    });

    // 重新发起axios请求
    return backoff.then(() => {
      return request(config);
    });
  }
);

// 配置请求重试
request.defaults.retry = RETRY_COUNT;
request.defaults.retryDelay = RETRY_DELAY;

// 📦 默认导出封装好的请求对象
export default request;
