<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增教室</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('会话记录', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ClassroomDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ClassroomDrawer from "@/views/proTable/components/ClassroomDrawer.vue";
// import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getClassroomList, addClassroom, editClassroom, deleteClassroom } from "@/api/modules/classroom";
import {
  ClassroomStatusOptions,
  getClassroomStatusTag,
  IsExistMediaOptions,
  getIsExistMediaTag,
  ClassroomEquipmentsOptions,
  getClassroomEquipmentsTag
} from "../constants";
import { useUserStore } from "@/stores/modules/user";

const router = useRouter();

// ProTable 实例
const proTable = ref<ProTableInstance>();

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.classrooms,
    total: data.total
  };
};
const user = useUserStore();
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  const { pageNum, pageSize, equipment, ...rest } = params;
  const newParams = { limit: pageSize, equipment: JSON.stringify(equipment), skip: (pageNum - 1) * pageSize, ...rest };
  return getClassroomList(newParams);
};
// 删除用户信息
const handleDelete = async (params: any) => {
  await useHandleData(deleteClassroom, params.classroom_id, `删除【${params.code}】教室`);
  proTable.value?.getTableList();
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "index", label: "序号", width: 80 },
  {
    prop: "code",
    label: "教室号",
    search: {
      el: "input"
    }
  },
  {
    prop: "capacity",
    label: "教室容量",
    width: 120,
    search: {
      el: "input-number",
      props: { min: 0 }
    }
  },
  { prop: "location", label: "教室位置", width: 300 },
  {
    prop: "equipment",
    label: "教室设备",
    search: { el: "select", props: { multiple: true, clearable: true } },
    enum: ClassroomEquipmentsOptions,
    width: 240,
    render: scope => {
      return scope.row.equipment
        .split(",")
        .filter(Boolean)
        .map((item: any) => {
          return (
            <el-tag style="margin:5px" key={item} type={getClassroomEquipmentsTag(item).type}>
              {getClassroomEquipmentsTag(item).label}
            </el-tag>
          );
        });
    }
  },
  {
    prop: "status",
    label: "状态",
    width: 120,
    search: { el: "select" },
    enum: ClassroomStatusOptions,
    render: scope => {
      return <el-tag type={getClassroomStatusTag(scope.row.status).type}>{getClassroomStatusTag(scope.row.status).label}</el-tag>;
    }
  },
  { prop: "desk_capacity", label: "桌子数量", width: 120 },
  {
    prop: "air_conditioner_count",
    label: "空调数量",
    width: 120,
    search: {
      el: "input-number",
      props: { min: 0, max: 5 }
    }
  },
  {
    prop: "multimedia_equipment",
    label: "是否配备多媒体设备",
    width: 120,
    search: { el: "select" },
    enum: IsExistMediaOptions,
    render: scope => {
      return (
        <el-tag type={getIsExistMediaTag(scope.row["multimedia_equipment"]).type}>
          {getIsExistMediaTag(scope.row["multimedia_equipment"]).label}
        </el-tag>
      );
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
]);

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof ClassroomDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, school_id: user.userInfo.school_id },
    api: title === "新增" ? addClassroom : title === "编辑" ? editClassroom : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
