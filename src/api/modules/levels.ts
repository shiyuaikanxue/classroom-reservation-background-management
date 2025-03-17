import { Levels, ResPage } from "@/api/interface/index";
import { PORT2 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 组别模块
 */
// 等级列表
export const getLevelList = (params: Levels.GetLevelsParams) => {
  return http.get<ResPage<Levels.LevelsList>>(PORT2 + `/level/list`, params);
};

// 特定组别等级列表
export const getLevelListById = (params: Levels.GetLevelsParams) => {
  const id = params.group_id;
  delete params.group_id;
  return http.get<ResPage<Levels.LevelsList>>(PORT2 + `/level/group/${id}`, params);
};

// 新增等级
export const createLevel = (params: Levels.CreateLevel) => {
  return http.post(PORT2 + `/level/create`, params);
};

// 删除等级
export const deleteLevel = (params: { id: string }) => {
  return http.delete(PORT2 + `/level/${params.id}`);
};

// 更新等级
export const updateLevel = (params: Levels.UpdateLevel) => {
  const id = params.id;
  const newParams = JSON.parse(JSON.stringify(params));
  delete newParams.id;
  return http.put(PORT2 + `/level/${id}`, newParams);
};
