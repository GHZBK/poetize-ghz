import request from "@/utils/request";

const getSortArticles_api = () => {
  return request({
    url: `/article/listSortArticle`,
    method: "get",
  });
};

const getArticles_api = (pagination) => {
  return request({
    url: `/article/listArticle`,
    method: "post",
    data: pagination,
  });
};

const saveArticle_api = (param, isAdmin = false) => {
  return request({
    url: `/article/saveArticle`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const updateArticle_api = (param, isAdmin = false) => {
  return request({
    url: `/article/updateArticle`,
    method: "post",
    data: param,
    isAdmin: isAdmin,
  });
};

const getArticleById_api = (param) => {
  return request({
    url: `/article/getArticleById`,
    method: "get",
    params: param,
  });
};

const deleteArticle_api = (param, isAdmin = false) => {
  return request({
    url: `/article/deleteArticle`,
    method: "get",
    params: param,
    isAdmin: isAdmin,
  });
};

export {
  getArticleById_api,
  getSortArticles_api,
  getArticles_api,
  saveArticle_api,
  updateArticle_api,
  deleteArticle_api,
};
