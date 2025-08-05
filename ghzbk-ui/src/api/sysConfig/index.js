import request from "@/utils/request";

const deleteConfig_api = (param, isAdmin = false) => {
  return request({
    url: `/sysConfig/deleteConfig`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const saveOrUpdateConfig_api = (param, isAdmin = false) => {
  return request({
    url: `/sysConfig/saveOrUpdateConfig`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const listConfig_api = (param, isAdmin = false) => {
  return request({
    url: `/sysConfig/listConfig`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

export { deleteConfig_api, saveOrUpdateConfig_api, listConfig_api };
