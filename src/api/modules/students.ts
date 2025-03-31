import http from "@/api";

/**
 * @name 学生管理模块
 */
// 学生列表
export function getStudentList(params: any) {
  return http.get("/student", params);
}
// 学生新增
export function addStudent(params: any) {
  return http.post("/student", params);
}
// 学生编辑
export function editStudent(params: any) {
  const { student_id, ...rest } = params;
  return http.put(`/student/${student_id}`, rest);
}
// 学生删除
export function deleteStudent(id: string) {
  return http.delete(`/student/${id}`);
}
