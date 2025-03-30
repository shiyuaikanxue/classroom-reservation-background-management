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

//学校模块
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
//学院模块
export namespace Colleges {
  export interface CollegesList {
    college_id: number;
    name: string;
    school_id: number;
  }
  export interface CreateColleges {
    name: string;
    school_id: number;
  }
  export interface ResponseList {
    colleges: CollegesList[]; // 学院列表
    total: number; // 总记录数
  }
  export interface ResponseData {
    currentPage: number; // 当前页码
    data: ResponseList;
    totalPages: number; // 总页数
  }
}
//专业模块
export namespace Majors {
  export interface MajorsList {
    major_id: number;
    name: string;
    college_id: number;
  }
  export interface CreateMajors {
    name: string;
    college_id: number;
  }
}
