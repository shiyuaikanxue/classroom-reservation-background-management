import { Group, ResPage } from "@/api/interface/index";
import { PORT2 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 组别模块
 */
// 组别列表
export const getGroupList = (params: Group.GetGroupList, loading = true) => {
  return http.get<ResPage<Group.GroupList>>(PORT2 + `/group/list`, params, { loading });
};

// 创建组别
export const createGroup = (params: Group.CreateGroup) => {
  return http.post<ResPage<Group.GroupList>>(PORT2 + `/group/create`, params);
};

// 删除组别
export const deleteGroup = (params: { id: string }) => {
  return http.delete<ResPage<Group.GroupList>>(PORT2 + `/group/${params.id}`);
};

// 获取组别详情
export const getGroupDetail = (params: { id: string }, loading = true) => {
  return http.get<ResPage<Group.GroupList>>(PORT2 + `/group/${params.id}`, undefined, { loading });
};

// 更新组别
export const updateGroup = (params: Group.GroupList) => {
  let temp = JSON.parse(JSON.stringify(params));
  let id = temp.id;
  delete temp.id;
  return http.put<ResPage<Group.GroupList>>(PORT2 + `/group/info/${id}`, temp);
};

// 获取组别成员
export const getGroupMembers = (params: Group.Menmbers) => {
  const newParams = JSON.parse(JSON.stringify(params));
  const id = newParams.groupId;
  delete newParams.groupId;
  return http.get<ResPage<Group.GroupList>>(PORT2 + `/group/${id}/members/filters`, newParams);
};
