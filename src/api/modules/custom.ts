import { PORT2 } from "@/api/config/servicePort";
import http from "@/api";

//创建画像
export const router_new = params => {
  // return http.post<Login.ResLogin>(`/login/admin`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
  return http.post(PORT2 + `/router/nodes_templates`, params, { loading: true }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { loading: false }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
};

//修改画像
export const update_customer = (params, id) => {
  return http.put(PORT2 + `/router/${id}/nodes_templates`, params, { loading: true }); // 控制当前请求不显示 loading
};
//删除画像
export const delete_customer = id => {
  return http.delete(PORT2 + `/router/${id}/nodes_templates`, { loading: true }); // 控制当前请求不显示 loading
};

//节点生成
export const router_taskClassify = params => {
  return http.post(PORT2 + `/router/task-llm-classify`, params, { loading: true }); // 控制当前请求不显示 loading
};
//customer/group_customer
//画像列表
export const get_group_customer = params => {
  return http.post(PORT2 + `/customer/group_customer/list`, params, { loading: false }); // 控制当前请求不显示 loading
};
//画像信息
export const get_router_data = id => {
  return http.get(PORT2 + `/router/${id}/nodes_templates`, undefined, { loading: false }); // 控制当前请求不显示 loading
};

//某组别可用画像列表
export const getGroupCustomerListByGroupId = (params: { id: string }, loading = false) => {
  return http.get(PORT2 + `/customer/group/${params.id}`, undefined, { loading }); // 控制当前请求不显示 loading
};
