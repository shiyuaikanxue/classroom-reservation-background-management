import { ResPage, Upload, User } from "@/api/interface/index";
import { PORT1, PORT2 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.get<ResPage<User.ResUserList>>(PORT2 + `/user/list`, params);
};

//获取查询用户列表
export const getSearchUserList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT2 + `/user/list`, params);
};
// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(PORT2 + `/user/create`, params);
};

// 注册用户
export const registerUser = (params: { id: string }) => {
  return http.post(PORT2 + `/user/signup`, params);
};

// 头像上传
export const uploadAvatar = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT2 + `/uploader/file`, params, { cancel: false });
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params);
};

// 编辑用户
export const editUser = (params: User.EditUser) => {
  let id = params.id;
  delete params.id;
  return http.put(PORT2 + `/user/${id}`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.delete(PORT2 + `/user/${params.id}`);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/user/change`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(PORT1 + `/user/rest_password`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/user/gender`);
};

// 获取用户组别列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/user/department`, {}, { cancel: false });
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};
