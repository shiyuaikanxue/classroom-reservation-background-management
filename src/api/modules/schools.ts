import { Schools, ResPage } from "@/api/interface/index";
import { PORT2 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 组别模块
 */
// 等级列表
export const getSchoolsList = (params: Schools.GetLevelsParams) => {
  return http.get<ResPage<Schools.SchoolsList>>(`/school`, params);
};

// 特定组别等级列表
export const getLevelListById = (params: Schools.GetLevelsParams) => {
  const id = params.group_id;
  delete params.group_id;
  return http.get<ResPage<Schools.SchoolsList>>(PORT2 + `/level/group/${id}`, params);
};

// 新增等级
export const createSchool = (params: Schools.CreateSchool) => {
  return http.post(`/school`, params);
};

// 删除等级
export const deleteSchool = (params: { school_id: string }) => {
  return http.delete(`/school/${params.school_id}`);
};

// 更新等级
export const updateSchool = (params: Schools.UpdateSchool) => {
  const id = params.school_id;
  const newParams = JSON.parse(JSON.stringify(params));
  delete newParams.school_id;
  return http.put(PORT2 + `/school/${id}`, newParams);
};
