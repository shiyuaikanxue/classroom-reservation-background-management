import { Admin, ResPage } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 管理员账号模块
 */
// 获取会话列表
export const getAdminList = (params: Admin.Params) => {
  return http.get<ResPage<Admin.ResAdminList>>(`/admin/school/${params.school_id}/admins`, params);
};
export const createAdmin = (params: Admin.CreateAdmin) => {
  return http.post<Admin.ResAdminList>(`/admin/addAdmin`, params);
};
