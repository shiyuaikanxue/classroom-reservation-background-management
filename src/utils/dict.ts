// ? 系统全局字典

/**
 * @description：用户性别
 */
export const genderType = [
  { label: "男", value: "Male" },
  { label: "女", value: "Female" }
];
export const age_groupDict = [
  { label: "中年", value: "Middle" },
  { label: "青年", value: "Young" }
];

/**
 * @description：用户状态
 */
export const userStatus = [
  { label: "启用", value: 1, tagType: "success" },
  { label: "禁用", value: 0, tagType: "danger" }
];

/**
 * @description：难度
 */
export const difficultyDict = [
  { label: "简单", value: "easy" },
  { label: "困难", value: "hard" }
];
/**
 * @roleDict 用户身份
 */
export const roleDict = {
  normal: {
    type: "primary",
    value: "普通用户"
  },
  admin: {
    type: "success",
    value: "管理员"
  },
  superadmin: {
    type: "warning",
    value: "超级管理员"
  }
};
/**
 * @levelColorDict 等级颜色
 */
export const levelColorDict = {
  1: "primary",
  2: "success",
  3: "info",
  4: "warning",
  5: "danger"
};

/**
 * @searchRoleDict  搜索用户身份字典
 */
export const searchRoleDict = [
  {
    label: "普通用户",
    value: "normal"
  },
  {
    label: "管理员",
    value: "admin"
  },
  {
    label: "超级管理员",
    value: "superadmin"
  }
];
