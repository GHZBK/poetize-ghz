// utils/ajaxUpload.js
export function useAjaxUpload() {
  /**
   * 错误信息封装
   */
  const getError = (action, option, xhr) => {
    let msg;
    if (xhr.response) {
      msg = `${xhr.response.error || xhr.response}`;
    } else if (xhr.responseText) {
      msg = `${xhr.responseText}`;
    } else {
      msg = `fail to ${action} ${xhr.status}`;
    }
    return new Error(msg);
  };

  /**
   * 获取响应体
   */
  const getBody = (xhr) => {
    const text = xhr.responseText || xhr.response;
    if (!text) return text;
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  };

  /**
   * 上传方法
   */
  const upload = (option) => {
    const xhr = new XMLHttpRequest();
    const action = option.action;

    if (xhr.upload) {
      xhr.upload.onprogress = function progress(e) {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100;
        }
        option.onProgress(e);
      };
    }

    const formData = new FormData();

    if (option.data) {
      Object.keys(option.data).forEach((key) => {
        formData.append(key, option.data[key]);
      });
    }

    formData.append(option.filename, option.file, option.file.name);

    xhr.onerror = function error(e) {
      option.onError(e);
    };

    xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
        return option.onError(getError(action, option, xhr));
      }
      option.onSuccess(getBody(xhr));
    };

    xhr.open("post", action, true);

    if (option.withCredentials && "withCredentials" in xhr) {
      xhr.withCredentials = true;
    }

    const headers = option.headers || {};
    for (let item in headers) {
      if (headers.hasOwnProperty(item) && headers[item] !== null) {
        xhr.setRequestHeader(item, headers[item]);
      }
    }
    xhr.send(formData);
    return xhr;
  };

  return {
    getError,
    getBody,
    upload,
  };
}
