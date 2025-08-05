import request from "@/utils/request";

//统一管理接口

const logout_api = () => {
  return request({
    url: `/user/logout`,
    method: "get",
  });
};

const getWebInfo_api = () => {
  return request({
    url: `/webInfo/getWebInfo`,
    method: "get",
  });
};

const getSysConfig_api = () => {
  return request({
    url: `/sysConfig/listSysConfig`,
    method: "get",
  });
};

const getSortInfo_api = () => {
  return request({
    url: `/webInfo/getSortInfo`,
    method: "get",
  });
};

const getCollect_api = () => {
  return request({
    url: `/webInfo/listCollect`,
    method: "get",
  });
};

const getSubscribe_api = (param) => {
  return request({
    url: `/user/subscribe`,
    method: "get",
    params: param,
  });
};

export {
  getSubscribe_api,
  getCollect_api,
  logout_api,
  getWebInfo_api,
  getSysConfig_api,
  getSortInfo_api,
};
