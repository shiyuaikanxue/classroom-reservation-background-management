<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}公告`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="请填写标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input
          type="textarea"
          v-model="drawerProps.row!.content"
          placeholder="请填写公告内容"
          :autosize="{ minRows: 4, maxRows: 6 }"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="生效日期" prop="start_time">
        <el-date-picker
          v-model="drawerProps.row!.start_time"
          type="datetime"
          placeholder="请选择生效日期"
          :default-time="new Date()"
          :disabled="drawerProps.isView"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="失效日期" prop="end_time">
        <el-date-picker
          v-model="drawerProps.row!.end_time"
          type="datetime"
          placeholder="请选择失效日期"
          :default-time="new Date()"
          :disabled="drawerProps.isView"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="公告状态" prop="status">
        <el-select v-model="drawerProps.row!.status" placeholder="请选择公告状态" :disabled="drawerProps.isView">
          <el-option
            v-for="item in AnnouncementStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Colleges, Group, Schools } from "@/api/interface";
import { AnnouncementStatusOptions } from "@/views/consultation/announcement/constants";
import { useUserStore } from "@/stores/modules/user";
//表单校验规则
const rules = reactive({
  title: [{ required: true, message: "请填写学院名称" }]
});
const user = useUserStore();
export interface DrawerProps {
  title: string;
  isAdd: boolean;
  isView: boolean;
  isEdit: boolean;
  row: Partial<Colleges.CollegesList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  isAdd: false,
  isEdit: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = JSON.parse(
        JSON.stringify({
          ...drawerProps.value.row,
          school_id: drawerProps.value.row?.school_id,
          admin_id: user.userInfo.admin_id
        })
      );
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}公告成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
