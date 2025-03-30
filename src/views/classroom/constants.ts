export enum ClassroomStatus {
  AVAILABLE = "available",
  MAINTENANCE = "maintenance"
}
export const ClassroomStatusOptions = [
  {
    label: "可用",
    value: ClassroomStatus.AVAILABLE
  },
  {
    label: "维修中...",
    value: ClassroomStatus.MAINTENANCE
  }
];
export const ClassroomStatusMap = {
  [ClassroomStatus.AVAILABLE]: {
    label: "可用",
    type: "success"
  },
  [ClassroomStatus.MAINTENANCE]: {
    label: "维修中",
    type: "warning"
  }
};
export function getClassroomStatusTag(status: ClassroomStatus) {
  return (
    ClassroomStatusMap[status] || {
      label: "未知",
      type: "default"
    }
  );
}
export enum IsExistMedia {
  YES = "1",
  NO = "0"
}

export const IsExistMediaOptions = [
  {
    label: "配备",
    value: IsExistMedia.YES
  },
  {
    label: "未配备",
    value: IsExistMedia.NO
  }
];
export const IsExistMediaMap = {
  [IsExistMedia.YES]: {
    label: "配备",
    type: "success"
  },
  [IsExistMedia.NO]: {
    label: "未配备",
    type: "danger"
  }
};
export function getIsExistMediaTag(isExistMedia: IsExistMedia) {
  return (
    IsExistMediaMap[isExistMedia] || {
      label: "未知",
      type: "default"
    }
  );
}
export enum ClassroomEquipments {
  BLACKBOARD = "黑板", // 传统黑板
  WHITEBOARD = "白板", // 磁性白板
  PROJECTOR = "投影仪", // 普通投影仪
  SMART_BOARD = "智能黑板", // 交互式智能黑板
  SOUND_SYSTEM = "音响系统", // 音频设备
  COMPUTER = "电脑", // 教学电脑
  DOCUMENT_CAMERA = "实物展台", // 文件摄像机
  AIR_CONDITIONER = "空调", // 空调设备
  LED_DISPLAY = "LED屏幕", // 大型显示屏
  WIRELESS_MIC = "无线麦克风", // 无线话筒
  VISUALIZER = "视频展示台", // 高拍仪
  LAB_EQUIPMENT = "实验设备", // 专用实验器材
  POWER_OUTLETS = "电源插座", // 充足电源接口
  NETWORK_PORT = "网络接口", // 有线网络接口
  WIFI_COVERAGE = "WiFi覆盖", // 无线网络
  MULTIMEDIA_PC = "多媒体电脑", // 带教学软件的电脑
  ELECTRONIC_SCREEN = "电子屏", // 触摸电子屏
  CONFERENCE_SYSTEM = "会议系统", // 专业会议设备
  RECORDING_DEVICE = "录播设备" // 课程录制设备
}
export const ClassroomEquipmentsOptions = [
  {
    label: "黑板",
    value: ClassroomEquipments.BLACKBOARD
  },
  {
    label: "白板",
    value: ClassroomEquipments.WHITEBOARD
  },
  {
    label: "投影仪",
    value: ClassroomEquipments.PROJECTOR
  },
  {
    label: "智能黑板",
    value: ClassroomEquipments.SMART_BOARD
  },
  {
    label: "音响系统",
    value: ClassroomEquipments.SOUND_SYSTEM
  },
  {
    label: "电脑",
    value: ClassroomEquipments.COMPUTER
  },
  {
    label: "实物展台",
    value: ClassroomEquipments.DOCUMENT_CAMERA
  },
  {
    label: "空调",
    value: ClassroomEquipments.AIR_CONDITIONER
  },
  {
    label: "LED屏幕",
    value: ClassroomEquipments.LED_DISPLAY
  },
  {
    label: "无线麦克风",
    value: ClassroomEquipments.WIRELESS_MIC
  },
  {
    label: "视频展示台",
    value: ClassroomEquipments.VISUALIZER
  },
  {
    label: "实验设备",
    value: ClassroomEquipments.LAB_EQUIPMENT
  },
  {
    label: "电源插座",
    value: ClassroomEquipments.POWER_OUTLETS
  },
  {
    label: "网络接口",
    value: ClassroomEquipments.NETWORK_PORT
  },
  {
    label: "WiFi覆盖",
    value: ClassroomEquipments.WIFI_COVERAGE
  },
  {
    label: "多媒体电脑",
    value: ClassroomEquipments.MULTIMEDIA_PC
  },
  {
    label: "电子屏",
    value: ClassroomEquipments.ELECTRONIC_SCREEN
  },
  {
    label: "会议系统",
    value: ClassroomEquipments.CONFERENCE_SYSTEM
  },
  {
    label: "录播设备",
    value: ClassroomEquipments.RECORDING_DEVICE
  }
];
export const ClassroomEquipmentsMap = {
  [ClassroomEquipments.BLACKBOARD]: {
    label: "黑板",
    type: "success"
  },
  [ClassroomEquipments.WHITEBOARD]: {
    label: "白板",
    type: "success"
  },
  [ClassroomEquipments.PROJECTOR]: {
    label: "投影仪",
    type: "success"
  },
  [ClassroomEquipments.SMART_BOARD]: {
    label: "智能黑板",
    type: "success"
  },
  [ClassroomEquipments.SOUND_SYSTEM]: {
    label: "音响系统",
    type: "success"
  },
  [ClassroomEquipments.COMPUTER]: {
    label: "电脑",
    type: "success"
  },
  [ClassroomEquipments.DOCUMENT_CAMERA]: {
    label: "实物展台",
    type: "success"
  },
  [ClassroomEquipments.AIR_CONDITIONER]: {
    label: "空调",
    type: "success"
  },
  [ClassroomEquipments.LED_DISPLAY]: {
    label: "LED屏幕",
    type: "success"
  },
  [ClassroomEquipments.WIRELESS_MIC]: {
    label: "无线麦克风",
    type: "success"
  },
  [ClassroomEquipments.VISUALIZER]: {
    label: "视频展示台",
    type: "success"
  },
  [ClassroomEquipments.LAB_EQUIPMENT]: {
    label: "实验设备",
    type: "success"
  },
  [ClassroomEquipments.POWER_OUTLETS]: {
    label: "电源插座",
    type: "success"
  },
  [ClassroomEquipments.NETWORK_PORT]: {
    label: "网络接口",
    type: "success"
  },
  [ClassroomEquipments.WIFI_COVERAGE]: {
    label: "WiFi覆盖",
    type: "success"
  },
  [ClassroomEquipments.MULTIMEDIA_PC]: {
    label: "多媒体电脑",
    type: "success"
  },
  [ClassroomEquipments.ELECTRONIC_SCREEN]: {
    label: "电子屏",
    type: "success"
  },
  [ClassroomEquipments.CONFERENCE_SYSTEM]: {
    label: "会议系统",
    type: "success"
  },
  [ClassroomEquipments.RECORDING_DEVICE]: {
    label: "录播设备",
    type: "success"
  }
};
export function getClassroomEquipmentsTag(equipment: ClassroomEquipments) {
  return (
    ClassroomEquipmentsMap[equipment] || {
      label: "未知",
      type: "default"
    }
  );
}
