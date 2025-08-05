import request from "@/utils/request";

//统一管理接口

//查询所有的社区空间
const getAreas = () => {
  return request({
    url: `/areas/getAreas`,
    method: "get",
  });
};

//获取社区空间Select组件
const payAreasUISelecTypet = () => {
  return request({
    url: `/areas/getUISelect`,
    method: "get",
  });
};

// 分页查询
const getAreasTypePage = (pageSize, pageNum, data) => {
  return request({
    url: `/areas/queryByPage?pageSize=${pageSize}&pageNum=${pageNum}`,
    method: "Post",
    data: data,
  });
};

//添加
const insertAreas = (data) => {
  return request({
    url: `/areas/add`,
    method: "Post",
    data: data,
  });
};

//修改
const updateAreas = (data) => {
  return request({
    url: `/areas/edit`,
    method: "put",
    data: data,
  });
};

//根据ID删除
const deleteAreasTypeById = (Id) => {
  return request({
    url: `/areas/deleteById/${Id}`,
    method: "delete",
  });
};

export {
  getAreas,
  getAreasTypePage,
  insertAreas,
  updateAreas,
  deleteAreasTypeById,
  payAreasUISelecTypet,
};
