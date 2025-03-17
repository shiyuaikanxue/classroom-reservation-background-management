<template>
  <div class="main-box">
    <TreeFilter
      label="name"
      v-if="authTreeFilter"
      title="组别列表(单选)"
      :default-value="initParam.groupId"
      @change="changeTreeFilter"
      :request-api="getGroupList"
    />
    <div class="table-box">
      <ProTable
        ref="proTable"
        :columns="columns"
        :request-api="getUserListFunc"
        :data-callback="dataCallback"
        :init-param="initParam"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
          <!-- <el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
          <el-button type="primary" plain @click="toDetail">To 平级详情页面</el-button> -->
          <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
            批量删除用户
          </el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row, true)">查看</el-button>
          <el-button type="primary" link :icon="View" @click="checkSession(scope.row)">历史记录</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row, true)">编辑</el-button>
          <!-- <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button> -->
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <UserDrawer ref="drawerRef" />
      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>
<script setup lang="tsx" name="useTreeFilter">
import { ref, reactive, computed } from "vue";
import { User } from "@/api/interface";
// import { useRouter } from "vue-router";
// import { ElMessage, ElMessageBox } from "element-plus";
import { dayjs, ElIcon, ElMessage } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
// import { useDownload } from "@/hooks/useDownload";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
// import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { getGroupList, getGroupMembers } from "@/api/modules/groups";
import {
  getUserList,
  deleteUser,
  editUser,
  addUser,
  // resetUserPassWord,
  // exportUserInfo,
  // BatchAddUser,
  // getUserStatus,
  // getUserGender,
  getUserDepartment,
  registerUser,
  getSearchUserList
} from "@/api/modules/user";
import { levelColorDict, roleDict, searchRoleDict } from "@/utils/dict";
import { useAuthStore } from "@/stores/modules/auth";
const useAuth = useAuthStore();
const router = useRouter();
const authTreeFilter = computed(() => useAuth.isSuper);
// 跳转详情页
/* const toDetail = () => {
  router.push(`/proTable/useTreeFilter/detail/123456?params=detail-page`);
}; */

// ProTable 实例
const proTable = ref<ProTableInstance>();

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.group_members,
    total: data.count
  };
};

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ groupId: "4000" });
// const initParam = reactive({});

const getUserListFunc = (params: any) => {
  // return getUserList(newParams);
  return getGroupMembers(params);
};

// 树形筛选切换
const changeTreeFilter = (val: string) => {
  // ElMessage.success("请注意查看请求参数变化 🤔");
  proTable.value!.pageable.pageNum = 1;
  initParam.groupId = val;
};

//传递当前用户id并跳转查看用户历史会话记录
const checkSession = (userInfo: User.ResUserList) => {
  router.push({
    path: "/chat",
    query: {
      id: userInfo.id
    }
  });
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", fixed: "left", width: 70 },

  { type: "index", label: "序号", width: 80 },
  { prop: "name", label: "用户姓名", width: 120, search: { el: "input", tooltip: "查询用户" } },
  {
    prop: "avatar",
    label: "头像",
    width: 120,
    render: scope => {
      return (
        <>
          <el-image
            style="width: 25px; height: 25px"
            src={scope.row.avatar}
            preview-teleported
            fit="contain"
            preview-src-list={[scope.row.avatar]}
            v-slots={{
              error: () => (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifycontent: "center", height: "100%" }}>
                    <ElIcon>
                      <IconPicture />
                    </ElIcon>
                  </div>
                </>
              )
            }}
          ></el-image>
        </>
      );
    }
  },
  {
    prop: "role",
    label: "用户身份",
    width: 120,
    enum: searchRoleDict,
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
    render: scope => {
      return (
        <>
          <el-text type={roleDict[scope.row.role].type}>{roleDict[scope.row.role].value}</el-text>
        </>
      );
    }
  },
  { prop: "phone_number", label: "手机号", width: 220, search: { el: "input" } },
  {
    prop: "ctime",
    label: "创建时间",
    width: 220,
    search: { el: "date-picker", span: 1, props: { type: "daterange", valueFormat: "YYYY-MM-DD" } },
    render: scope => {
      return <div>{dayjs(scope.row.ctime).format("YYYY-MM-DD HH:mm")}</div>;
    }
  },

  {
    prop: "level_id",
    label: "用户等级",
    width: 120,
    search: { el: "input" },
    render: scope => {
      return (
        <>
          <el-tag type={levelColorDict[scope.row.level_id % 5]}>{"level " + scope.row.level_id}</el-tag>
        </>
      );
    }
  },
  {
    prop: "is_valid",
    label: "用户状态",
    width: 120,
    sortable: true,
    tag: true,
    enum: [
      { label: "启用", value: true },
      { label: "禁用", value: false }
    ],
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
    render: scope => {
      return (
        <>
          <el-tag type={scope.row.is_valid ? "success" : "danger"}>{scope.row.is_valid ? "启用" : "禁用"}</el-tag>
        </>
      );
    }
  },
  { prop: "operation", label: "操作", fixed: "right" }
]);

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.name}】用户`);
  proTable.value?.getTableList();
};

// // 重置用户密码
// const resetPass = async (params: User.ResUserList) => {
//   await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
//   proTable.value?.getTableList();
// };

// 导出用户列表
/* const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
}; */

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
/* const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
}; */

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}, isShowTotal: boolean = false) => {
  const params = {
    title,
    isView: title === "查看",
    isRegister: title === "新增",
    row: { ...row },
    api: title === "新增" ? registerUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params, isShowTotal);
};
</script>
