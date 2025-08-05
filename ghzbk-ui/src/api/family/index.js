import request from "@/utils/request";

const getFamily_api = () => {
  return request({
    url: `/family/getFamily`,
    method: "get",
  });
};

const getAdminFamily_api = () => {
  return request({
    url: `/family/getAdminFamily`,
    method: "get",
  });
};

const getListRandomFamily_api = () => {
  return request({
    url: `/family/listRandomFamily`,
    method: "get",
  });
};

const saveFamily_api = (param) => {
  return request({
    url: `/family/saveFamily`,
    method: "post",
    data: param,
  });
};

const deleteFamily_api = (param, isAdmin = false) => {
  return request({
    url: `/family/deleteFamily`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const changeLoveStatus_api = (param, isAdmin = false) => {
  return request({
    url: `/family/changeLoveStatus`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

export {
  getListRandomFamily_api,
  saveFamily_api,
  getFamily_api,
  getAdminFamily_api,
  deleteFamily_api,
  changeLoveStatus_api,
};
