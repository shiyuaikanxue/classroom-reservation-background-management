<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}学生`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填学生姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="drawerProps.row!.gender" placeholder="请选择学生性别">
          <el-option v-for="gender in GenderOptions" :key="gender.label" :value="gender.value" :label="gender.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="drawerProps.row!.phone" placeholder="请填写手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="drawerProps.row!.password" placeholder="请填写密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="学院" prop="college_id">
        <el-select v-model="drawerProps.row!.college_id" placeholder="请选择所属学院" @change="handleMajor">
          <el-option
            v-for="college in colleges"
            :key="college.college_id"
            :value="college.college_id"
            :label="college.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业" prop="major_id">
        <el-select v-model="drawerProps.row!.major_id" placeholder="请选择所属专业" @change="handleClass">
          <el-option v-for="major in majors" :key="major.major_id" :value="major.major_id" :label="major.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="class_id">
        <el-select v-model="drawerProps.row!.class_id" placeholder="请选择所属班级">
          <el-option
            v-for="itemClass in classes"
            :key="itemClass.class_id"
            :value="itemClass.class_id"
            :label="itemClass.class_name"
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
import { Colleges, Group, Majors, Schools } from "@/api/interface";
import { getAllColleges } from "@/api/modules/college";
import { getAllMajors } from "@/api/modules/major";
import { getAllClasses } from "@/api/modules/classes";
import { GenderOptions } from "@/views/students/constants";
import CryptoJS from "crypto-js";
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "请填写学生姓名" }],
  gender: [{ required: true, message: "请选择学生性别" }],
  password: [{ required: true, message: "请填写密码" }],
  phone: [{ required: true, message: "请填写手机号" }],
  college_id: [{ required: true, message: "请选择所属学院" }],
  major_id: [{ required: true, message: "请选择所属专业" }],
  class_id: [{ required: true, message: "请选择所属班级" }]
});
// import md5 from "md5";
const key = CryptoJS.enc.Utf8.parse("y7xHoYB1CKYtj+nR");
export interface DrawerProps {
  title: string;
  isAdd: boolean;
  isView: boolean;
  isEdit: boolean;
  row: Partial<Majors.MajorsList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const colleges = ref([]);
const majors = ref([]);
const classes = ref([]);
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  isAdd: false,
  isEdit: false,
  title: "",
  row: {}
});
const init = async () => {
  handleCollegeOption();
  if (drawerProps.value.row.college_id !== undefined) {
    handleMajorOption();
  }
  if (drawerProps.value.row.major_id !== undefined) {
    handleClassesOption();
  }
  // 获取专业列表
};
const handleCollegeOption = async () => {
  const res = await getAllColleges({ school_id: drawerProps.value.row?.school_id });
  colleges.value = res.data.colleges;
};
const handleMajorOption = async () => {
  const majorRes = await getAllMajors({ college_id: drawerProps.value.row?.college_id });
  majors.value = majorRes.data.majors;
};
const handleClassesOption = async () => {
  const classRes = await getAllClasses({ major_id: drawerProps.value.row?.major_id });
  classes.value = classRes.data.classes;
  // 获取班级列表
};
const handleMajor = async () => {
  drawerProps.value.row.major_id = undefined;
  drawerProps.value.row.class_id = undefined;
  handleMajorOption();
  // 获取班级列表
};
const handleClass = async () => {
  // 获取班级列表
  drawerProps.value.row.class_id = undefined;
  handleClassesOption();
};
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  init();
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const encrypted = CryptoJS.AES.encrypt(drawerProps.value.row.password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const encryptedPassword = encrypted.toString();
      const params = JSON.parse(JSON.stringify({ ...drawerProps.value.row, password: encryptedPassword }));
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value?.title}学生成功！` });
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
