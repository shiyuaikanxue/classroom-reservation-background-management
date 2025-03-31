export enum ClassDivided {
  第一节课 = "08:00-08:45",
  第二节课 = "08:55-09:40",
  第三节课 = "10:15-11:00",
  第四节课 = "11:10-11:55",
  第五节课 = "14:00-14:45",
  第六节课 = "14:55-15:40",
  第七节课 = "16:15-17:00",
  第八节课 = "17:10-17:55",
  第九节课 = "19:00-19:45",
  第十节课 = "19:55-20:40",
  第十一节课 = "20:50-21:35",
  第十二节课 = "21:45-22:30",
  "第一、二节课" = "08:00-09:40",
  "第三、四节课" = "10:15-11:55",
  "第五、六节课" = "14:00-15:40",
  "第七、八节课" = "16:15-17:55",
  "第九、十节课" = "19:00-20:40",
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  "第十一、十二节课" = "21:45-22:30",
  "第一、二、三节课" = "08:00-11:00",
  "第五、六、七节课" = "14:00-17:00",
  "第九、十、十一节课" = "19:00-21:35"
}
export const ClassDividedOptions = [
  { value: ClassDivided.第一节课, label: ClassDivided.第一节课 },
  { value: ClassDivided.第二节课, label: ClassDivided.第二节课 },
  { value: ClassDivided.第三节课, label: ClassDivided.第三节课 },
  { value: ClassDivided.第四节课, label: ClassDivided.第四节课 },
  { value: ClassDivided.第五节课, label: ClassDivided.第五节课 },
  { value: ClassDivided.第六节课, label: ClassDivided.第六节课 },
  { value: ClassDivided.第七节课, label: ClassDivided.第七节课 },
  { value: ClassDivided.第八节课, label: ClassDivided.第八节课 },
  { value: ClassDivided.第九节课, label: ClassDivided.第九节课 },
  { value: ClassDivided.第十节课, label: ClassDivided.第十节课 },
  { value: ClassDivided.第十一节课, label: ClassDivided.第十一节课 },
  { value: ClassDivided.第十二节课, label: ClassDivided.第十二节课 },
  { value: ClassDivided["第一、二节课"], label: ClassDivided["第一、二节课"] },
  { value: ClassDivided["第三、四节课"], label: ClassDivided["第三、四节课"] },
  { value: ClassDivided["第五、六节课"], label: ClassDivided["第五、六节课"] },
  { value: ClassDivided["第七、八节课"], label: ClassDivided["第七、八节课"] },
  { value: ClassDivided["第九、十节课"], label: ClassDivided["第九、十节课"] },
  { value: ClassDivided["第十一、十二节课"], label: ClassDivided["第十一、十二节课"] },
  { value: ClassDivided["第一、二、三节课"], label: ClassDivided["第一、二、三节课"] },
  { value: ClassDivided["第五、六、七节课"], label: ClassDivided["第五、六、七节课"] },
  { value: ClassDivided["第九、十、十一节课"], label: ClassDivided["第九、十、十一节课"] }
];
export const ClassDividedMap = {
  [ClassDivided.第一节课]: {
    label: "第一节课",
    type: "primary"
  },
  [ClassDivided.第二节课]: {
    label: "第二节课",
    type: "primary"
  },
  [ClassDivided.第三节课]: {
    label: "第三节课",
    type: "primary"
  },
  [ClassDivided.第四节课]: {
    label: "第四节课",
    type: "primary"
  },
  [ClassDivided.第五节课]: {
    label: "第五节课",
    type: "primary"
  },
  [ClassDivided.第六节课]: {
    label: "第六节课",
    type: "primary"
  },
  [ClassDivided.第七节课]: {
    label: "第七节课",
    type: "primary"
  },
  [ClassDivided.第八节课]: {
    label: "第八节课",
    type: "primary"
  },
  [ClassDivided.第九节课]: {
    label: "第九节课",
    type: "primary"
  },
  [ClassDivided.第十节课]: {
    label: "第十节课",
    type: "primary"
  },
  [ClassDivided.第十一节课]: {
    label: "第十一节课",
    type: "primary"
  },
  [ClassDivided.第十二节课]: {
    label: "第十二节课",
    type: "primary"
  },
  [ClassDivided["第一、二节课"]]: {
    label: "第一、二节课",
    type: "success"
  },
  [ClassDivided["第三、四节课"]]: {
    label: "第三、四节课",
    type: "success"
  },
  [ClassDivided["第五、六节课"]]: {
    label: "第五、六节课",
    type: "success"
  },
  [ClassDivided["第七、八节课"]]: {
    label: "第七、八节课",
    type: "success"
  },
  [ClassDivided["第九、十节课"]]: {
    label: "第九、十节课",
    type: "success"
  },
  [ClassDivided["第十一、十二节课"]]: {
    label: "第十一、十二节课",
    type: "success"
  },
  [ClassDivided["第一、二、三节课"]]: {
    label: "第一、二、三节课",
    type: "warning"
  },
  [ClassDivided["第五、六、七节课"]]: {
    label: "第五、六、七节课",
    type: "warning"
  },
  [ClassDivided["第九、十、十一节课"]]: {
    label: "第九、十、十一节课",
    type: "warning"
  }
};
export function getClassDividedTag(value) {
  return ClassDividedMap[value] || { label: "", type: "" };
}

export enum ReservationStatus {
  已同意 = "approved",
  等待 = "pending",
  已驳回 = "rejected",
  已撤销 = "cancelled"
}
export const ReservationStatusOptions = [
  { value: ReservationStatus.已同意, label: "已同意" },
  { value: ReservationStatus.等待, label: "等待" },
  { value: ReservationStatus.已驳回, label: "已驳回" },
  { value: ReservationStatus.已撤销, label: "已撤销" }
];
export const ReservationStatusMap = {
  [ReservationStatus.已同意]: {
    label: ReservationStatus.已同意,
    type: "success"
  },
  [ReservationStatus.等待]: {
    label: ReservationStatus.等待,
    type: "warning"
  },
  [ReservationStatus.已驳回]: {
    label: ReservationStatus.已驳回,
    type: "danger"
  },
  [ReservationStatus.已撤销]: {
    label: ReservationStatus.已撤销,
    type: "default"
  }
};
export function getReservationStatusTag(value) {
  return ReservationStatusMap[value] || { label: "", type: "" };
}
export function canDelete(value) {
  return value === ReservationStatus.已同意 || value === ReservationStatus.已撤销 || value === ReservationStatus.已驳回;
}
export function canApprove(value) {
  return value === ReservationStatus.等待;
}
export function canReject(value) {
  return value === ReservationStatus.等待;
}
