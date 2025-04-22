export enum AnnouncementStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived"
}

export const AnnouncementStatusOptions = [
  {
    label: "草稿",
    value: AnnouncementStatus.DRAFT
  },
  {
    label: "已发布",
    value: AnnouncementStatus.PUBLISHED
  },
  {
    label: "已归档",
    value: AnnouncementStatus.ARCHIVED
  }
];

export const AnnouncementStatusTag = {
  [AnnouncementStatus.DRAFT]: {
    label: "草稿",
    type: "warning"
  },
  [AnnouncementStatus.PUBLISHED]: {
    label: "已发布",
    type: "success"
  },
  [AnnouncementStatus.ARCHIVED]: {
    label: "已归档",
    type: "info"
  }
};
