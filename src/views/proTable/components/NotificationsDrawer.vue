<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}专业`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="通知标题" prop="title">
        <el-input v-model="drawerProps.row.title" placeholder="请输入通知标题" />
      </el-form-item>
      <el-form-item label="通知内容" prop="message">
        <el-input
          type="textarea"
          v-model="drawerProps.row.message"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入通知内容"
        />
      </el-form-item>
      <el-form-item label="生效日期" prop="start_time">
        <el-date-picker v-model="drawerProps.row.start_time" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="失效日期" prop="end_time">
        <el-date-picker v-model="drawerProps.row.end_time" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="面向全校" prop="publish_type">
        <el-switch
          v-model="drawerProps.row.publish_type"
          active-value="all"
          inactive-value="selected"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="通知对象" prop="targets" v-if="drawerProps.row.publish_type === 'selected'">
        <el-select v-model="drawerProps.row.targets" placeholder="请选择通知对象" multiple>
          <el-option v-for="item in college_list" :key="item.college_id" :label="item.name" :value="item.college_id" />
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
import { Colleges, Group, Majors, Schools } from "@/api/interface";
import { getAllColleges } from "@/api/modules/college";
import { useUserStore } from "@/stores/modules/user";
//表单校验规则
const rules = reactive({
  title: [{ required: true, message: "请填写通知标题" }]
});
const user = useUserStore();
export interface DrawerProps {
  title: string;
  isAdd: boolean;
  isView: boolean;
  isEdit: boolean;
  row: Partial<Majors.MajorsList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const college_list = ref<Colleges.CollegesList[]>([]);
const isLoaded = ref(false);
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  isAdd: false,
  isEdit: false,
  title: "",
  row: {}
});
const getColleges = async () => {
  if (isLoaded.value) return;
  try {
    const res = await getAllColleges({ school_id: drawerProps.value.row?.school_id });
    college_list.value = res.data?.colleges as Colleges.CollegesList[];
    isLoaded.value = true;
  } catch (error) {
    console.log(error);
  }
};
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  drawerProps.value.row.targets = drawerProps.value.row.targets.map(item => item.id);
  getColleges();
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
          admin_id: user.userInfo.admin_id
        })
      );
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value?.title}专业成功！` });
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
