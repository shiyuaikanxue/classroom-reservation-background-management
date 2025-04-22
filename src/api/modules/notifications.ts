import http from "@/api";

//通知模块
export function getAllNotifications(params: any) {
  return http.get("/notifications", params, { loading: false }); // 控制当前请求不显示 loading
}
// 通知新增
export function addNotification(params: any) {
  return http.post(`/notifications`, params);
}
// 通知编辑
export function editNotification(params: any) {
  const { id, ...rest } = params;
  return http.put(`/notifications/${id}`, rest);
}
// 通知删除
export function deleteNotification(id: string) {
  return http.delete(`/notifications/${id}`);
}
