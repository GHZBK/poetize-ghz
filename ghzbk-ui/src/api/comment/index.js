import request from "@/utils/request";

const getCommentCount_api = (param) => {
  return request({
    url: `/comment/getCommentCount`,
    method: "get",
    params: param,
  });
};

const listComment_api = (param) => {
  return request({
    url: `/comment/listComment`,
    method: "post",
    data: param,
  });
};

const saveComment_api = (param) => {
  return request({
    url: `/comment/saveComment`,
    method: "post",
    data: param,
  });
};

export { getCommentCount_api, listComment_api, saveComment_api };
