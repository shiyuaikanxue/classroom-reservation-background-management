<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @drag-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增学校</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="UserFilled">管理员账号</el-button>
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="PictureRounded" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <LevelsDrawer ref="drawerRef" />
    <CustomerManage ref="customerRef"></CustomerManage>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";
import { Group, Schools, User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";

import { useAuthButtons } from "@/hooks/useAuthButtons";
import { dayjs, ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";

import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";

import { CirclePlus, Delete, View, PictureRounded, UserFilled } from "@element-plus/icons-vue";

import CustomerManage, { PropsParams } from "@/views/proTable/components/CustomerManage.vue";
import { createSchool, deleteSchool, getSchoolsList, getLevelListById, updateSchool } from "@/api/modules/schools";
import LevelsDrawer, { DrawerProps } from "@/views/proTable/components/LevelsDrawer.vue";
import { isDef } from "@/utils/is";
import { getSchoolLabelByType, getSchoolTagByType, SchoolsTypeOptions } from "../constants";

const router = useRouter();
//该实例是否是特定的组别
const isSignalGroup = ref(false);

onMounted(() => {
  const route = useRoute();
  if (isDef(route.query.group_id)) {
    initParam.group_id = route.query.group_id as string;
    isSignalGroup.value = true;
  }
});

// ProTable 实例
const proTable = ref<ProTableInstance>();

export interface InitParmas {
  group_id?: string;
  skip?: number;
  limit?: number;
  name?: string;
  default?: boolean;
}

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive<InitParmas>({});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.schools,
    total: data.total
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.skip = (params.pageNum - 1) * params.pageSize;
  newParams.limit = params.pageSize;
  delete newParams.createTime;
  delete newParams.pageNum;
  delete newParams.pageSize;
  if (isSignalGroup.value) {
    return getLevelListById(newParams);
  }
  return getSchoolsList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 自定义渲染表头（使用tsx语法）
// const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
//   return (
//     <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
//       {scope.column.label}
//     </el-button>
//   );
// };

// 表格配置项
const columns = reactive<ColumnProps<Schools.SchoolsList>[]>([
  {
    prop: "name",
    label: "校名",
    search: { el: "input" },
    width: 150
  },
  {
    prop: "address",
    label: "地址",
    width: 200,
    render: scope => {
      return (
        <el-button type="primary" link>
          {scope.row.address}
        </el-button>
      );
    }
  },
  {
    prop: "type",
    label: "学校类型",
    search: { el: "select" },
    enum: SchoolsTypeOptions,
    render: scope => {
      return <el-tag type={getSchoolTagByType(scope.row.type)}>{getSchoolLabelByType(scope.row.type)}</el-tag>;
    },
    width: 150
  },
  {
    prop: "contact",
    label: "联系电话",
    width: 200
  },
  { prop: "website", label: "官网", width: 200 },
  { prop: "email", label: "邮箱", width: 200 },
  { prop: "city", label: "所在城市", search: { el: "input" }, width: 200 },
  { prop: "country", label: "所在国家", search: { el: "input" }, width: 200 },
  { prop: "college_count", label: "学院数量", search: { el: "input-number", props: { min: 0 } }, width: 200 },
  { prop: "major_count", label: "专业数量", search: { el: "input-number", props: { min: 0 } }, width: 200 },
  { prop: "student_count", label: "学生人数", search: { el: "input-number", props: { min: 0 } }, width: 200 },
  {
    prop: "created_at",
    label: "新增时间",
    width: 180,
    render: scope => {
      return <div>{dayjs(scope.row.created_at).format("YYYY-MM-DD HH:mm")}</div>;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 400 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除等级信息
const deleteAccount = async (params: Schools.SchoolsList) => {
  await useHandleData(deleteSchool, { school_id: [params.school_id] }, `确认删除【${params.name}】及其全部·信息吗？`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof LevelsDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Schools.UpdateSchool> = {}) => {
  const params: DrawerProps = {
    title,
    isAdd: title === "新增",
    isView: title === "查看",
    isEdit: title === "编辑",
    row: { ...row },
    api: title === "新增" ? createSchool : title === "编辑" ? updateSchool : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

//画像管理
const customerRef = ref<InstanceType<typeof CustomerManage> | null>(null);
const openCustomerModel = (row: Group.GroupList) => {
  const params: PropsParams = {
    row: { ...row },
    getTableList: proTable.value?.getTableList
  };
  customerRef.value?.acceptParams(params);
};
</script>
