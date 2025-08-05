import request from "@/utils/request";

const deleteResource_api = (param, isAdmin = false, json = true) => {
  return request({
    url: `/resource/deleteResource`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
    isForm: !json,
  });
};

const listResource_api = (param, isAdmin = false) => {
  return request({
    url: `/resource/listResource`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const changeResourceStatus_api = (param, isAdmin = false) => {
  return request({
    url: `/resource/changeResourceStatus`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const uploadResource_api = (param) => {
  return request({
    url: "/resource/upload",
    method: "post",
    data: param,
  });
};

const qiNiuResource_api = (param) => {
  return request({
    url: "/qiniu/getUpToken",
    method: "get",
    params: param,
  });
};

export {
  deleteResource_api,
  listResource_api,
  changeResourceStatus_api,
  uploadResource_api,
  qiNiuResource_api,
};
