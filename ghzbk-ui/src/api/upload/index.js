import request from "@/utils/request";

/**
 * 📤 文件上传
 * @param {string} url - 接口地址
 * @param {FormData} param - 上传的 FormData 对象
 * @param {boolean} isAdmin - 是否管理员上传
 * @param {object} option - 上传进度回调
 */
export function upload_api(url, param, isAdmin = false, option) {
  const headers = {
    Authorization: localStorage.getItem(isAdmin ? "adminToken" : "userToken"),
    "Content-Type": "multipart/form-data",
  };

  const config = {
    headers,
    timeout: 60000,
    onUploadProgress: option?.onProgress,
  };

  return request.post(url, param, config);
}

/**
 * 📤 七牛云上传
 * @param {string} url - 七牛上传地址
 * @param {FormData} param - 上传的 FormData 对象
 */
export function uploadQiniu_api(url, param) {
  const config = {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  };

  return request.post(url, param, config);
}
