<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback">
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="success" link v-if="canApprove(scope.row.status)" :icon="Delete" @click="handleApprove(scope.row)">
          同意
        </el-button>
        <el-button type="warning" link v-if="canReject(scope.row.status)" :icon="Delete" @click="handleReject(scope.row)">
          驳回
        </el-button>
        <el-button type="danger" link v-if="canDelete(scope.row.status)" :icon="Delete" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import { dayjs, ElMessage } from "element-plus";
import StudentDrawer from "@/views/proTable/components/StudentDrawer.vue";
// import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getAllReservations, deleteReservation, approveReservation, rejectReservation } from "@/api/modules/reservation";
import { useUserStore } from "@/stores/modules/user";
import {
  getClassDividedTag,
  ClassDividedOptions,
  ReservationStatusOptions,
  ReservationStatus,
  canDelete,
  canApprove,
  canReject
} from "../constants";
const router = useRouter();
// 使用与加密相同的密钥
// ProTable 实例
const proTable = ref<ProTableInstance>();

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.reservations,
    total: data.total
  };
};

const user = useUserStore();
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  const { pageNum, pageSize, equipment, ...rest } = params;
  const newParams = { limit: pageSize, equipment: JSON.stringify(equipment), skip: (pageNum - 1) * pageSize, ...rest };
  return getAllReservations(newParams);
};
const handleDelete = async (params: any) => {
  await useHandleData(deleteReservation, params.reservation_id, `删除【${params.activity_name}】预约记录`);
  proTable.value?.getTableList();
};
const handleApprove = async (params: any) => {
  await useHandleData(approveReservation, params.reservation_id, `同意【${params.activity_name}】预约申请`);
  proTable.value?.getTableList();
};

const handleReject = async (params: any) => {
  await useHandleData(rejectReservation, params.reservation_id, `驳回【${params.activity_name}】预约申请`);
  proTable.value?.getTableList();
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "index", label: "序号", width: 80 },
  { prop: "status", isShow: false, label: "预约状态", search: { el: "select" }, enum: ReservationStatusOptions },
  {
    prop: "activity_name",
    label: "活动名称",
    width: 220,
    search: {
      el: "input"
    }
  },

  {
    prop: "description",
    label: "活动描述",
    width: 220,
    search: {
      el: "input"
    }
  },
  {
    prop: "classroom_code",
    label: "教室",
    width: 220
  },
  {
    prop: "student_name",
    label: "申请人",
    width: 220
  },
  {
    prop: "teacher_name",
    label: "负责老师",
    width: 220
  },
  {
    prop: "classroom_location",
    label: "教室所在位置",
    width: 220
  },
  {
    prop: "date",
    label: "日期",
    width: 220,
    render: scope => {
      return <div>{dayjs(scope.row.date).format("YYYY-MM-DD HH:mm")}</div>;
    }
  },
  {
    prop: "time_slot",
    label: "时间点",
    width: 220,
    render: scope => {
      return (
        <el-tag type={getClassDividedTag(scope.row.time_slot).type}>
          {getClassDividedTag(scope.row.time_slot).label || scope.row.time_slot}
        </el-tag>
      );
    }
  },
  {
    prop: "participants",
    label: "参与人数",
    width: 220
  },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);
</script>
