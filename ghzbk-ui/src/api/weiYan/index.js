import request from "@/utils/request";

const deleteWeiYan_api = (param) => {
  return request({
    url: `/weiYan/deleteWeiYan`,
    method: "get",
    params: param,
  });
};

const saveNews_api = (param) => {
  return request({
    url: `/weiYan/saveNews`,
    method: "post",
    data: param,
  });
};

const saveWeiYan_api = (param) => {
  return request({
    url: `/weiYan/saveWeiYan`,
    method: "post",
    data: param,
  });
};

const listNews_api = (param) => {
  return request({
    url: `/weiYan/listNews`,
    method: "post",
    data: param,
  });
};

const listWeiYan_api = (param) => {
  return request({
    url: `/weiYan/listWeiYan`,
    method: "post",
    data: param,
  });
};

export {
  saveWeiYan_api,
  deleteWeiYan_api,
  saveNews_api,
  listNews_api,
  listWeiYan_api,
};
