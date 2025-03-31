export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

export const GenderOptions = [
  {
    label: "男",
    value: Gender.MALE
  },
  {
    label: "女",
    value: Gender.FEMALE
  }
];
export const GenderMap = {
  [Gender.MALE]: {
    label: "男",
    type: "primary"
  },
  [Gender.FEMALE]: {
    label: "女",
    type: "success"
  }
};
export function getGenderTag(gender: Gender) {
  return (
    GenderMap[gender] || {
      label: "未知",
      type: "default"
    }
  );
}
