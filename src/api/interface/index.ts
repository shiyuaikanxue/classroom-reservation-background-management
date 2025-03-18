import { SchoolType } from "@/views/schools/constants";

// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  skip: number;
  limit: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    access_token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams {
    name: string;
    role: string;
    phone_number: string;
    is_valid: boolean;
    level_id: number;
    ctime: string[];
    pageNum: number;
    pageSize: number;
  }
  export interface ResUserList {
    id: string;
    name: string;
    user: { detail: { age: number } };
    openid: string;
    status: number;
    avatar: string;
    role: string;
    phone_number: string;
    password: string;
    level_id: number;
    is_valid: number;
    children?: ResUserList[];
    ctime?: string;
  }
  export interface ResStatus {
    userLabel: string;
    userValue: boolean;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }

  export interface EditUser {
    id?: string;
    avatar: string;
    phone_number: string;
    password: string;
    role: string;
  }
}
export namespace Admin {
  export interface Params {
    school_id?: number;
  }
  export interface ResAdminList {
    id: string;
    username: string;
    phone_number: string;
    ctime: string;
    admin_id: number;
    role: string;
    status: number;
  }
  export interface CreateAdmin {
    school_id: number;
    username: string;
    password: string;
    phone_number: string;
    role: string;
  }
}
//会话管理模块
export namespace Chat {
  //会话列表的请求参数
  export interface GetChatList {
    user_id?: string;
    pageNum: number;
    pageSize: number;
    ctime?: string | Date;
    name?: string; //客户姓名
  }
  //会话列表的返回参数
  export interface ChatList {
    id: string;
    avatar: string;
    customer_id: string; //客户id
    conversation_id: string;
    customer_name: string; //客户姓名
    ctime: string | Date; //开始时间
    utime: string;
    uid: string;
    whole_conversation_text: string;
    whole_conversation_voice: string;
    whole_voice_duration: string;
    router_id: string;
  }
  export interface HistoryResponse {
    chat_history: Session[];
  }
  export interface CommnetResponse {
    llm_suggestion: CommentDetail;
  }
  export interface CommentDetail {
    dimensions: Comment[];
    suggestions: string;
    total_score: number;
  }
  //评价
  export interface Comment {
    detail: string;
    dimension: string;
    score: number;
  }
  //对话片段
  export interface Session {
    customer: string;
    user: string;
  }

  export interface createChatInfo {}
  export interface updateChatInfo {}
}

//组别模块
export namespace Group {
  //组别列表的请求参数
  export interface GetGroupList {
    page: number;
    page_size: number;
  }
  //组别列表
  export interface GroupList {
    id: string;
    available_customers: string;
    creator_id: number;
    ctime: string | Date;
    description: string;
    invite_code: number;
    name: string;
    utime: string | Date;
  }
  export interface CreateGroup {
    name: string;
    description: string;
    available_customers: string | string[];
  }
  export interface UpdateGroup {
    name: string;
    description: string;
    available_customers: string | string[];
    invite_code: string;
  }
  export interface Menmbers {
    groupID: string;
    pageNum: number;
    pageSize: number;
    name?: string;
    role?: string;
    phone_number?: string;
    is_valid?: boolean;
    level_id?: number;
    ctime?: string[];
  }
}

//等级模块
export namespace Schools {
  export interface GetLevelsParams {
    group_id?: string;
    skip: number;
    limit: number;
  }
  export interface SchoolsList {
    address: string;
    city: string;
    college_count: number;
    contact: string;
    country: string;
    created_at: string;
    email: string;
    major_count: number;
    name: string;
    phone: string;
    school_id: number;
    student_count: number;
    type: SchoolType;
    website: string;
  }
  export interface CreateSchool {
    address: string;
    city: string;
    contact: string;
    country: string;
    email: string;
    name: string;
    type: SchoolType;
    website: string;
  }
  export interface UpdateSchool extends CreateSchool {
    school_id: number;
  }
}
