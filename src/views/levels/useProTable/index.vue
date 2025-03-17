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
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增等级</el-button>
        <!-- <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button> -->
        <!-- <el-button v-auth="'export'" type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button> -->
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
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
import { Group, Levels, User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";

import { useAuthButtons } from "@/hooks/useAuthButtons";
import { dayjs, ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";

import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";

import { CirclePlus, Delete, View, PictureRounded } from "@element-plus/icons-vue";

import CustomerManage, { PropsParams } from "@/views/proTable/components/CustomerManage.vue";
import { createLevel, deleteLevel, getLevelList, getLevelListById, updateLevel } from "@/api/modules/levels";
import LevelsDrawer, { DrawerProps } from "@/views/proTable/components/LevelsDrawer.vue";
import { isDef } from "@/utils/is";

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
    list: data.levels,
    total: data.count
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
  return getLevelList(newParams);
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
const columns = reactive<ColumnProps<Levels.LevelsList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "index", label: "序号", width: 80 },
  {
    prop: "id",
    label: "id",
    width: 150
  },
  {
    prop: "name",
    label: "等级名称",
    search: { el: "input", tooltip: "查询等级" },
    width: 200,
    render: scope => {
      return (
        <el-button type="primary" link>
          {scope.row.name}
        </el-button>
      );
    }
  },
  {
    prop: "description",
    label: "描述"
  },
  { prop: "group_id", label: "所属部门", search: { el: "input" }, width: 200 },
  {
    // 多级 prop
    prop: "customer_ids",
    label: "可用画像",
    width: 200,
    render: scope => {
      return <div>{scope.row.customer_ids || "暂无"}</div>;
    }
  },
  {
    prop: "default",
    label: "是否为默认等级",
    width: 120,
    render: scope => {
      return <el-tag>{scope.row.default ? "是" : "否"}</el-tag>;
    }
  },
  {
    prop: "ctime",
    label: "创建时间",
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    },
    render: scope => {
      return <div>{dayjs(scope.row.ctime).format("YYYY-MM-DD HH:mm")}</div>;
    }
  },
  {
    prop: "utime",
    label: "上次更新时间",
    width: 180,
    render: scope => {
      return <div>{dayjs(scope.row.utime).format("YYYY-MM-DD HH:mm")}</div>;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 250 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除等级信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteLevel, { id: [params.id] }, `删除【${params.name}】等级`);
  proTable.value?.getTableList();
};

// 批量删除等级信息
const batchDelete = async (ids: string[]) => {
  const deleteBatch = function (parmas: string[]) {
    return new Promise((resolve, reject) => {
      const deleteHandle = function (id: string) {
        return deleteLevel({ id });
      };
      Promise.all([...parmas.map(item => deleteHandle(item))]).then(resolve, reject);
    });
  };
  await useHandleData(deleteBatch, ids, "删除所选等级信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof LevelsDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params: DrawerProps = {
    title,
    isAdd: title === "新增",
    isView: title === "查看",
    isEdit: title === "编辑",
    row: { ...row },
    api: title === "新增" ? createLevel : title === "编辑" ? updateLevel : undefined,
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
