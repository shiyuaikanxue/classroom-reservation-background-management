import http from "@/api";

/**
 * @name 教室管理模块
 */
//
// 教室列表
export function getClassroomList(params: any) {
  return http.get("/classrooms", params);
}

// 教室新增
export function addClassroom(params: any) {
  return http.post("/classrooms", params);
}

// 教室编辑
export function editClassroom(params: any) {
  const { classroom_id, ...rest } = params;
  return http.put(`/classrooms/${classroom_id}`, rest);
}

// 教室删除
export function deleteClassroom(id: string) {
  return http.delete(`/classrooms/${id}`);
}
