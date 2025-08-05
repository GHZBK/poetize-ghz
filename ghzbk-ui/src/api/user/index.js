import request from "@/utils/request";

const login_api = (param, isAdmin = false, json = true) => {
  return request({
    url: `/user/login`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
    isForm: !json,
  });
};

const updateSecretInfo_api = (param, isAdmin = false, json = true) => {
  return request({
    url: `/user/updateSecretInfo`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
    isForm: !json,
  });
};

const register_api = (param) => {
  return request({
    url: `/user/regist`,
    method: "post",
    data: param,
  });
};

const updateUserInfo_api = (param) => {
  return request({
    url: `/user/updateUserInfo`,
    method: "post",
    data: param,
  });
};

const updateForForgetPassword_api = (param, isAdmin = false, json = true) => {
  return request({
    url: `/user/updateForForgetPassword`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
    isForm: !json,
  });
};

const logout_api = (param, isAdmin = false) => {
  return request({
    url: `/user/logout`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const getCodeForForgetPassword_api = (param) => {
  return request({
    url: `/user/getCodeForForgetPassword`,
    method: "get",
    params: param,
  });
};

const getCodeForBind_api = (param) => {
  return request({
    url: `/user/getCodeForBind`,
    method: "get",
    params: param,
  });
};

export {
  getCodeForForgetPassword_api,
  getCodeForBind_api,
  updateForForgetPassword_api,
  login_api,
  register_api,
  updateUserInfo_api,
  updateSecretInfo_api,
  logout_api,
};
