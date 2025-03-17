<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('会话记录', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ChatDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Chat, User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { dayjs, ElIcon, ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import ChatDrawer from "@/views/proTable/components/ChatDrawer.vue";
// import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { Delete, View } from "@element-plus/icons-vue";
import { deleteChat, getChatList } from "@/api/modules/chat";

const router = useRouter();

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ user_id: undefined });

//初始化拿到用户id发起请求
onBeforeMount(() => {
  initParam.user_id = useRoute().query.id;
});
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.chats,
    total: data.total_count
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  params.name = params.customer_name;
  delete params.customer_name;
  return getChatList(params);
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
const columns = reactive<ColumnProps<Chat.ChatList>[]>([
  { type: "selection", fixed: "left", width: 70 },

  { type: "index", label: "序号", width: 80 },
  {
    prop: "customer_name",
    label: "客户姓名",
    search: {
      el: "input"
    }
  },
  {
    prop: "avatar",
    label: "客户头像",
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
                <div style={{ display: "flex", alignItems: "center", justifycontent: "center", height: "100%" }}>
                  <ElIcon>
                    <IconPicture />
                  </ElIcon>
                </div>
              </>
            )
          }}
        ></el-image>
      );
    }
  },
  {
    prop: "ctime",
    label: "开始时间",
    search: { el: "date-picker", span: 1, props: { type: "daterange", valueFormat: "YYYY-MM-DD" } },
    render: scope => {
      return <>{dayjs(scope.row.ctime).format("YYYY-MM-DD HH:mm")}</>;
    }
  },
  {
    prop: "utime",
    label: "结束时间",
    render: scope => {
      return <>{dayjs(scope.row.utime).format("YYYY-MM-DD HH:mm")}</>;
    }
  },
  {
    prop: "whole_voice_duration",
    label: "会话时长",
    render: scope => {
      return <>{scope.row.whole_voice_duration}分钟</>;
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
const deleteAccount = async (params: Chat.ChatList) => {
  await useHandleData(deleteChat, { id: [params.id] }, `删除了与${params.customer_name}的会话`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteChat, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof ChatDrawer> | null>(null);
const openDrawer = (title: string, row: Chat.ChatList) => {
  drawerRef.value?.init(title, row);
};
</script>
