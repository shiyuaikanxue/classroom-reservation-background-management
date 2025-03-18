<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增账号</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="PictureRounded" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <AdminDrawer ref="drawerRef" />
    <CustomerManage ref="customerRef"></CustomerManage>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";
import { Admin, Group, Schools, User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";

import { useAuthButtons } from "@/hooks/useAuthButtons";
import { dayjs, ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";

import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";

import { CirclePlus, Delete, View, PictureRounded, UserFilled } from "@element-plus/icons-vue";
import AdminDrawer from "@/views/proTable/components/AdminDrawer.vue";
import { getAdminList, createAdmin } from "@/api/modules/admin";
import { PropsParams } from "@/views/proTable/components/CustomerManage.vue";
import { deleteSchool, updateSchool } from "@/api/modules/schools";
import { DrawerProps } from "@/views/proTable/components/SchoolsDrawer.vue";

const router = useRouter();
const school_id = ref();
onMounted(() => {
  const route = useRoute();
  if (route.query.school_id) {
    school_id.value = route.query.school_id;
    proTable.value?.getTableList();
  }
});

// ProTable 实例
const proTable = ref<ProTableInstance>();

export interface InitParams extends Admin.Params {}

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive<InitParams>({});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.admins,
    total: data.total
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  console.log("getTableList", { ...params, school_id: school_id.value });
  return getAdminList({ ...params, school_id: school_id.value });
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps<Admin.ResAdminList>[]>([
  {
    prop: "username",
    label: "用户名",
    search: { el: "input" },
    width: 150
  },
  {
    prop: "avatar",
    label: "头像",
    width: 200,
    render: scope => {
      return (
        <el-button type="primary" link>
          {scope.row.avatar}
        </el-button>
      );
    }
  },
  {
    prop: "phone_number",
    label: "联系电话",
    width: 200
  },
  {
    prop: "created_at",
    label: "创建时间",
    width: 180,
    render: scope => {
      return <div>{dayjs(scope.row.created_at).format("YYYY-MM-DD HH:mm")}</div>;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 400 }
]);

// 删除等级信息
const deleteAccount = async (params: Schools.SchoolsList) => {
  await useHandleData(deleteSchool, { school_id: [params.school_id] }, `确认删除【${params.name}】及其全部·信息吗？`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof AdminDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Schools.UpdateSchool> = {}) => {
  const params: DrawerProps = {
    title,
    isAdd: title === "新增",
    isView: title === "查看",
    isEdit: title === "编辑",
    row: { ...row },
    api: title === "新增" ? createAdmin : title === "编辑" ? updateSchool : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params, school_id.value);
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
