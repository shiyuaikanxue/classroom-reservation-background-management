import http from "@/api";
import { Colleges } from "../interface";

//得到学院列表
export const getAllColleges = (params): Promise<Colleges.ResponseData> => {
  return http.get(`/college`, params, { loading: false }); // 控制当前请求不显示 loading
};

//添加学院
export const addCollege = params => {
  return http.post(`/college`, params);
};
//编辑学院
export const editCollege = params => {
  const { college_id, ...rest } = params;
  return http.put(`/college/${college_id}`, rest);
};
//删除学院
export const deleteCollege = params => {
  const { college_id } = params;
  return http.delete(`/college/${college_id}`);
};
