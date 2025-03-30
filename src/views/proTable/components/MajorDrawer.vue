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
      <el-form-item label="所属学院" prop="college_id">
        <el-select v-model="drawerProps.row!.college_id" placeholder="请选择所属学院" clearable>
          <el-option v-for="item in college_list" :key="item.name" :label="item.name" :value="item.college_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写专业名称" clearable></el-input>
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
//表单校验规则
const rules = reactive({
  college_id: [{ required: true, message: "请选择所属学院" }],
  name: [{ required: true, message: "请填写专业名称" }]
});

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
  getColleges();
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = JSON.parse(JSON.stringify(drawerProps.value.row));
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
