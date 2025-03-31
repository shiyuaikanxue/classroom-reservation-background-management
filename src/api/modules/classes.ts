import http from "@/api";

//班级模块
export function getAllClasses(params: any) {
  return http.get("/classes", params, { loading: false }); // 控制当前请求不显示 loading
}

// 班级新增
export function addClass(params: any) {
  return http.post("/classes", params);
}

// 班级编辑
export function editClass(params: any) {
  const { class_id, ...rest } = params;
  return http.put(`/classes/${class_id}`, rest);
}

// 班级删除
export function deleteClass(id: string) {
  return http.delete(`/classes/${id}`);
}
