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
      <template #tableHeader="">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增画像</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useHandleData } from "@/hooks/useHandleData";
// import { useDownload } from "@/hooks/useDownload";
// import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
// import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { getUserList } from "@/api/modules/user";
import { genderType, age_groupDict } from "@/utils/dict";
import { get_group_customer, delete_customer } from "@/api/modules/custom";
import { Picture as IconPicture } from "@element-plus/icons-vue";
const router = useRouter();
// 跳转详情页
const toDetail = (title, row) => {
  const pathList = {
    新增: "/customer/list/add",
    编辑: `/customer/list/edit/${row.router_id}`,
    查看: `/customer/list/detail/${row.router_id}`
  };
  let path = pathList[title];
  router.push({ path, query: { params: title } });
};

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  return get_group_customer(params);
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// const { BUTTONS } = useAuthButtons();

// 自定义渲染表头（使用tsx语法）
// const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
//   return (
//     <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
//       {scope.column.label}
//     </el-button>
//   );
// };

// 表格配置项
// <ColumnProps<User.ResUserList>[]>
const columns = reactive<any>([
  { type: "index", label: "序号", width: 80, fixed: "left" },
  {
    prop: "avatar",
    label: "客户头像",
    width: 200,
    render: scope => {
      return (
        <el-image
          style="width: 25px; height: 25px"
          src={scope.row.avatar}
          preview-teleported
          fit="contain"
          preview-src-list={[scope.row.avatar]}
          v-slots={{
            error: () => (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  {/* <ElIcon>
                     <el-icon :size="size" :color="color">
                    <IconPicture />
                  </ElIcon> */}

                  <el-icon>
                    <IconPicture />
                  </el-icon>
                </div>
              </>
            )
          }}
        ></el-image>
      );
    }
  },
  {
    prop: "name",
    label: "客户名称",
    width: 200,
    search: { el: "input", tooltip: "查询画像" }
    // fixed: "left"
  },
  {
    prop: "age_group",
    label: "年龄",
    tag: true,
    isShow: true,
    enum: age_groupDict,
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
    render: scope => {
      return <>{scope.row.age_group == "Middle" ? <el-tag type="warning">中年</el-tag> : <el-tag type="success">青年</el-tag>}</>;
    }
  },
  {
    prop: "gender",
    label: "性别",
    tag: true,
    isShow: true,
    enum: genderType,
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
    render: scope => {
      return <>{scope.row.gender == "Male" ? <el-tag type="primary">男</el-tag> : <el-tag type="danger">女</el-tag>}</>;
    }
  },
  {
    prop: "ctime",
    label: "创建时间",
    // headerRender,
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "daterange", valueFormat: "YYYY-MM-DD" },
      defaultValue: []
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: any) => {
  await useHandleData(delete_customer, params.router_id, `删除【${params.name}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
// const batchDelete = async (id: string[]) => {
//   await useHandleData(delete_customer, { id }, "删除所选用户信息");
//   proTable.value?.clearSelection();
//   proTable.value?.getTableList();
// };

// 重置用户密码
// const resetPass = async (params: User.ResUserList) => {
//   await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
//   proTable.value?.getTableList();
// };

// 切换用户状态
// const changeStatus = async (row: User.ResUserList) => {
//   await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
//   proTable.value?.getTableList();
// };

// 导出用户列表
// const downloadFile = async () => {
//   ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
//     useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
//   );
// };

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
// const batchAdd = () => {
//   const params = {
//     title: "用户",
//     tempApi: exportUserInfo,
//     importApi: BatchAddUser,
//     getTableList: proTable.value?.getTableList
//   };
//   // dialogRef.value?.acceptParams(params);
// };

// 打开 drawer(新增、查看、编辑)
// const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  // const params = {
  //   title,
  //   isView: title === "查看",
  //   row: { ...row }
  //   // api: title === "add" ? addUser : title === "edit" ? editUser : undefined,
  //   // getTableList: proTable.value?.getTableList
  // };
  // drawerRef.value?.acceptParams(params);
  // let paramsRow: any = JSON.stringify(params);
  toDetail(title, row);
};
</script>
<style scoped></style>
