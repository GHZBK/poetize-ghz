import request from "@/utils/request";
import constant from "@/utils/constant";

/**
 * 获取社会新闻接口
 */
const getShehui_api = () => {
  return request({
    url: constant.shehui,
    method: "get",
  });
};

/**
 * 获取今日诗词
 */
const getGuShi_api = () => {
  return request({
    url: constant.jinrishici,
    method: "get",
  });
};

const getHitokoto_api = () => {
  return request({
    url: constant.hitokoto, // 如果 this.$constant.hitokoto 是完整URL，这里填完整URL
    method: "get",
  });
};

export { getShehui_api, getGuShi_api, getHitokoto_api };
