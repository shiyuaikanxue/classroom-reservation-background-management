// 定义学校类型枚举
export enum SchoolType {
  PUBLIC_UNIVERSITY = "0",
  PRIVATE_UNIVERSITY = "1",
  INDEPENDENT_COLLEGE = "2"
}

// 定义学校类型选项数组，用于下拉选择框等场景
export const SchoolsTypeOptions = [
  { label: "公办大学", value: SchoolType.PUBLIC_UNIVERSITY },
  { label: "民办大学", value: SchoolType.PRIVATE_UNIVERSITY },
  { label: "独立学院", value: SchoolType.INDEPENDENT_COLLEGE }
];

// 定义学校类型标签配置，用于显示标签样式等场景
export const SchoolsTags = {
  [SchoolType.PUBLIC_UNIVERSITY]: {
    label: "公办大学",
    type: "success"
  },
  [SchoolType.PRIVATE_UNIVERSITY]: {
    label: "民办大学",
    type: "primary"
  },
  [SchoolType.INDEPENDENT_COLLEGE]: {
    label: "独立学院",
    type: "warning"
  }
};

// 新增工具函数，用于根据枚举值获取对应的标签配置
export function getSchoolTagByType(type: SchoolType) {
  return SchoolsTags[type]?.type;
}

// 新增工具函数，用于根据枚举值获取对应的标签文本
export function getSchoolLabelByType(type: SchoolType) {
  return SchoolsTags[type]?.label || "";
}
