<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增学生</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <StudentDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import StudentDrawer from "@/views/proTable/components/StudentDrawer.vue";
// import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getStudentList, addStudent, editStudent, deleteStudent } from "@/api/modules/students";
import { useUserStore } from "@/stores/modules/user";
import { GenderOptions, getGenderTag } from "../constants";
const router = useRouter();
// 使用与加密相同的密钥
// ProTable 实例
const proTable = ref<ProTableInstance>();

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.students,
    total: data.total
  };
};
const user = useUserStore();
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  const { pageNum, pageSize, equipment, ...rest } = params;
  const newParams = { limit: pageSize, equipment: JSON.stringify(equipment), skip: (pageNum - 1) * pageSize, ...rest };
  return getStudentList(newParams);
};
// 删除用户信息
const handleDelete = async (params: any) => {
  await useHandleData(deleteStudent, params.student_id, `删除【${params.name}】学生`);
  proTable.value?.getTableList();
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "index", label: "序号", width: 80 },
  {
    prop: "name",
    label: "姓名",
    search: {
      el: "input"
    }
  },
  {
    prop: "gender",
    label: "性别",
    search: { el: "select" },
    enum: GenderOptions,
    render: scope => {
      return <el-text type="success">{getGenderTag(scope.row.gender).label}</el-text>;
    },
    width: 120
  },
  {
    prop: "college_name",
    label: "学院",
    width: 220
  },
  {
    prop: "major_name",
    label: "专业",
    width: 220
  },
  {
    prop: "class_name",
    label: "班级",
    width: 220
  },
  {
    prop: "email",
    label: "邮箱",
    width: 220
  },
  {
    prop: "school_name",
    label: "所属学校",
    width: 220
  },
  {
    prop: "phone",
    label: "电话号码",
    width: 220
  },
  {
    prop: "password",
    label: "密码",
    render: scope => {
      return <el-text type="success">{scope.row.password}</el-text>;
    },
    width: 220
  },
  {
    prop: "last_login_time",
    label: "上次登录时间",
    width: 220
  },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
]);

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof StudentDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, school_id: user.userInfo.school_id },
    api: title === "新增" ? addStudent : title === "编辑" ? editStudent : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
