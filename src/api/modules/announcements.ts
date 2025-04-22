import http from "@/api";

//公告模块
export function getAllAnnouncements(params: any) {
  return http.get("/announcement", params, { loading: false }); // 控制当前请求不显示 loading
}

// 公告新增
export function addAnnouncement(params: any) {
  return http.post(`/announcement`, params);
}
// 公告编辑
export function editAnnouncement(params: any) {
  const { id, ...rest } = params;
  return http.put(`/announcement/${id}`, rest);
}
// 公告删除
export function deleteAnnouncement(id: string) {
  return http.delete(`/announcement/${id}`);
}
// 公告详情
export function getAnnouncementDetail(id: string) {
  return http.get(`/announcement/${id}`);
}
