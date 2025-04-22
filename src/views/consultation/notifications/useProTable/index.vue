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
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增通知</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <NotificationsDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage, dayjs } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { getUserList } from "@/api/modules/user";
import { getAllNotifications, addNotification, editNotification, deleteNotification } from "@/api/modules/notifications";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/modules/user";
import NotificationsDrawer from "@/views/proTable/components/NotificationsDrawer.vue";
const router = useRouter();
const user = useUserStore();

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.notifications,
    total: data.total
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  const newParams = { limit: pageSize, skip: (pageNum - 1) * pageSize, school_id: user.userInfo.school_id, ...rest };
  return getAllNotifications(newParams);
};

// 表格配置项
// <ColumnProps<User.ResUserList>[]>
const columns = reactive<any>([
  { type: "index", label: "序号", width: 80, fixed: "left" },
  {
    prop: "admin_name",
    label: "发布人",
    width: 200
  },
  {
    prop: "created_at",
    label: "创建时间",
    render: scope => {
      return <div>{dayjs(scope.row.created_at).format("YYYY-MM-DD HH:mm")}</div>;
    },
    width: 200
  },
  {
    prop: "title",
    label: "标题",
    width: 200
  },
  {
    prop: "updated_at",
    label: "上次编辑时间",
    render: scope => {
      return <div>{dayjs(scope.row.updated_at).format("YYYY-MM-DD HH:mm")}</div>;
    },
    width: 200
  },
  {
    prop: "start_time",
    label: "生效日期",
    render: scope => {
      return <div>{dayjs(scope.row.start_time).format("YYYY-MM-DD HH:mm")}</div>;
    },
    width: 200
  },

  {
    prop: "end_time",
    label: "失效日期",
    render: scope => {
      return <div>{dayjs(scope.row.end_time).format("YYYY-MM-DD HH:mm")}</div>;
    },
    width: 200
  },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
]);

// 删除用户信息
const handleDelete = async (params: any) => {
  await useHandleData(deleteNotification, params.id, `删除【${params.title}】通知`);
  proTable.value?.getTableList();
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof NotificationsDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, school_id: user.userInfo.school_id },
    api: title === "新增" ? addNotification : title === "编辑" ? editNotification : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
<style scoped></style>
