import constant from "./constant";
import CryptoJS from "crypto-js";
import { useMainStore } from "@/store";
import request from "@/utils/request";
import { ElMessage } from "element-plus";

// Vue3 setup 版，导出所有方法
export function useCommon() {
  const store = useMainStore();
  /**
   * 过滤推送消息
   */
  const pushNotification = (notices, isNotification) => {
    if (isNotification) {
      if (isEmpty(notices)) {
        return [];
      } else {
        return notices.filter(
          (f) =>
            "推送标题：" !== f.substr(0, 5) &&
            "推送封面：" !== f.substr(0, 5) &&
            "推送链接：" !== f.substr(0, 5)
        );
      }
    } else {
      let push = {};
      notices.forEach((notice) => {
        if ("推送标题：" === notice.substr(0, 5)) {
          push["标题"] = notice.substr(5);
        } else if ("推送封面：" === notice.substr(0, 5)) {
          push["封面"] = notice.substr(5);
        } else if ("推送链接：" === notice.substr(0, 5)) {
          push["链接"] = notice.substr(5);
        }
      });
      return push;
    }
  };

  /**
   * 判断是否移动端
   */
  const mobile = () => {
    let flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag && flag.length && flag.length > 0;
  };

  /**
   * 判断是否为空
   */
  const isEmpty = (value) => {
    if (
      typeof value === "undefined" ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && Object.keys(value).length === 0)
    ) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * AES加密
   */
  const encrypt = (plaintText) => {
    let options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    };
    let key = CryptoJS.enc.Utf8.parse(constant.cryptojs_key);
    let encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
    return encryptedData.toString().replace(/\//g, "_").replace(/\+/g, "-");
  };

  /**
   * AES解密
   */
  const decrypt = (encryptedBase64Str) => {
    let val = encryptedBase64Str.replace(/\-/g, "+").replace(/_/g, "/");
    let options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    };
    let key = CryptoJS.enc.Utf8.parse(constant.cryptojs_key);
    let decryptedData = CryptoJS.AES.decrypt(val, key, options);
    return CryptoJS.enc.Utf8.stringify(decryptedData);
  };

  /**
   * 表情替换
   */
  const faceReg = (content) => {
    content = content.replace(/\[[^\[^\]]+\]/g, (word) => {
      let index = constant.emojiList.indexOf(
        word.replace("[", "").replace("]", "")
      );
      if (index > -1) {
        let url =
          store.state.sysConfig["webStaticResourcePrefix"] +
          "emoji/q" +
          (index + 1) +
          ".gif";
        return `<img loading="lazy" style="vertical-align: middle;width: 32px;height: 32px" src="${url}" title="${word}"/>`;
      } else {
        return word;
      }
    });
    return content;
  };

  /**
   * 图片替换
   */
  const pictureReg = (content) => {
    content = content.replace(/\[[^\[^\]]+\]/g, (word) => {
      let index = word.indexOf(",");
      if (index > -1) {
        let arr = word.replace("[", "").replace("]", "").split(",");
        return `<img loading="lazy" class="pictureReg" style="border-radius: 5px;width: 100%;max-width: 250px;display: block" src="${arr[1]}" title="${arr[0]}"/>`;
      } else {
        return word;
      }
    });
    return content;
  };

  /**
   * 大图预览
   */
  const imgShow = (select) => {
    $(select).click(function () {
      let src = $(this).attr("src");
      $("#bigImg").attr("src", src);

      $("<img/>")
        .attr("src", src)
        .on("load", function () {
          let windowW = $(window).width();
          let windowH = $(window).height();
          let realWidth = this.width;
          let realHeight = this.height;
          let imgWidth, imgHeight;
          let scale = 0.8;

          if (realHeight > windowH * scale) {
            imgHeight = windowH * scale;
            imgWidth = (imgHeight / realHeight) * realWidth;
            if (imgWidth > windowW * scale) {
              imgWidth = windowW * scale;
            }
          } else if (realWidth > windowW * scale) {
            imgWidth = windowW * scale;
            imgHeight = (imgWidth / realWidth) * realHeight;
          } else {
            imgWidth = realWidth;
            imgHeight = realHeight;
          }

          $("#bigImg").css("width", imgWidth);
          let w = (windowW - imgWidth) / 2;
          let h = (windowH - imgHeight) / 2;
          $("#innerImg").css({ top: h, left: w });
          $("#outerImg").fadeIn("fast");
        });

      $("#outerImg").click(function () {
        $(this).fadeOut("fast");
      });
    });
  };

  /**
   * 字符串转时间戳
   */
  const getDateTimeStamp = (dateStr) => {
    return Date.parse(dateStr.replace(/-/gi, "/"));
  };

  /**
   * 保存资源
   */
  const saveResource = async (
    type,
    path,
    size,
    mimeType,
    originalName,
    storeType,
    isAdmin = false
  ) => {
    const resource = {
      type,
      path,
      size,
      mimeType,
      storeType,
      originalName,
    };

    try {
      await request({
        url: `${constant.baseURL}/resource/saveResource`,
        method: "post",
        data: resource,
        isAdmin,
      });
    } catch (error) {
      ElMessage.error(error.message);
    }
  };

  return {
    pushNotification,
    mobile,
    isEmpty,
    encrypt,
    decrypt,
    faceReg,
    pictureReg,
    imgShow,
    getDateTimeStamp,
    saveResource,
  };
}

export default useCommon;
