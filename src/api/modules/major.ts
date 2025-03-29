import http from "@/api";

//得到专业列表
export const getAllMajors = params => {
  return http.get(`/major`, params, { loading: false }); // 控制当前请求不显示 loading
};
//添加专业
export const addMajor = params => {
  return http.post(`/major`, params);
};
//编辑专业
export const editMajor = params => {
  const { major_id, ...rest } = params;
  return http.put(`/major/${major_id}`, rest);
};
//删除专业
export const deleteMajor = params => {
  const { major_id } = params;
  return http.delete(`/major/${major_id}`);
};
