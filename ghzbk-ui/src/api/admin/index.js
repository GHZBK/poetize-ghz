import request from "@/utils/request";

const bossList_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/comment/boss/list`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const bossUser_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/comment/user/list`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const bossDeleteComment_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/comment/boss/deleteComment`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const userDeleteComment_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/comment/user/deleteComment`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};
const getArticleById_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/article/getArticleById`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const articleBossList_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/article/boss/list`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const articleUserList_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/article/user/list`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const changeArticleStatus_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/article/changeArticleStatus`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const treeHoleBossList_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/treeHole/boss/list`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const userList_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/user/list`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const changeUserStatus_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/user/changeUserStatus`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const changeUserAdmire_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/user/changeUserAdmire`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const changeUserType_api = (param, isAdmin = false) => {
  return request({
    url: `/admin/user/changeUserType`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

export {
  bossList_api,
  bossUser_api,
  userDeleteComment_api,
  bossDeleteComment_api,
  getArticleById_api,
  articleUserList_api,
  articleBossList_api,
  changeArticleStatus_api,
  treeHoleBossList_api,
  userList_api,
  changeUserStatus_api,
  changeUserAdmire_api,
  changeUserType_api,
};
