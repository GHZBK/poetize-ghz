import request from "@/utils/request";

const getFriends_api = () => {
  return request({
    url: `/webInfo/listFriend`,
    method: "get",
  });
};

const saveFriend_api = (param) => {
  return request({
    url: `/webInfo/saveFriend`,
    method: "post",
    data: param,
  });
};

const getListFunny_api = () => {
  return request({
    url: `/webInfo/listFunny`,
    method: "get",
  });
};

const getListAdminLovePhoto_api = () => {
  return request({
    url: `/webInfo/listAdminLovePhoto`,
    method: "get",
  });
};

// const getArticleById_api = (param) => {
//   return request({
//     url: `/article/getArticleById`,
//     method: "post",
//     params: param,
//   });
// };
const listResourcePath_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/listResourcePath`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const saveTreeHole_api = (param) => {
  return request({
    url: `/webInfo/saveTreeHole`,
    method: "post",
    data: param,
  });
};

const getAdmire_api = () => {
  return request({
    url: `/webInfo/getAdmire`,
    method: "get",
  });
};

const getHistoryInfo_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/getHistoryInfo`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const listSortAndLabel_api = () => {
  return request({
    url: `/webInfo/listSortAndLabel`,
    method: "get",
  });
};

const updateResourcePath_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/updateResourcePath`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const saveResourcePath_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/saveResourcePath`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const deleteResourcePath_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/deleteResourcePath`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const deleteSort_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/deleteSort`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const deleteLabel_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/deleteLabel`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const saveSort_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/saveSort`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const updateSort_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/updateSort`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const saveLabel_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/saveLabel`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const updateLabel_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/updateLabel`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const getSortInfo_api = () => {
  return request({
    url: `/webInfo/getSortInfo`,
    method: "get",
  });
};

const deleteTreeHole_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/deleteTreeHole`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

const updateWebInfo_api = (param, isAdmin = false) => {
  return request({
    url: `/webInfo/updateWebInfo`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

export {
  saveTreeHole_api,
  listResourcePath_api,
  saveFriend_api,
  getFriends_api,
  getListFunny_api,
  getListAdminLovePhoto_api,
  getAdmire_api,
  getHistoryInfo_api,
  listSortAndLabel_api,
  updateResourcePath_api,
  saveResourcePath_api,
  deleteResourcePath_api,
  deleteSort_api,
  deleteLabel_api,
  saveSort_api,
  updateSort_api,
  saveLabel_api,
  updateLabel_api,
  getSortInfo_api,
  deleteTreeHole_api,
  updateWebInfo_api,
};
