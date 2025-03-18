<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}学校`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="drawerProps.row!.username" placeholder="请填写用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="drawerProps.row!.password" placeholder="请填写密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone_number">
        <el-input v-model="drawerProps.row!.phone_number" placeholder="请填写电话号码" clearable></el-input>
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
import { SchoolsTypeOptions } from "@/views/schools/constants";
import { ElMessage, FormInstance } from "element-plus";
import { Admin, Group, Schools } from "@/api/interface";
import CryptoJS from "crypto-js";
// import md5 from "md5";
const key = CryptoJS.enc.Utf8.parse("y7xHoYB1CKYtj+nR");
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "请填写学校名称" }],
  type: [{ required: true, message: "请选择所属部门" }]
});
const my_school_id = ref<number>();
export interface DrawerProps {
  title: string;
  isAdd: boolean;
  isView: boolean;
  isEdit: boolean;
  row: Partial<Admin.CreateAdmin>;
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
const acceptParams = async (params: DrawerProps, school_id: number) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  my_school_id.value = school_id;
  console.log(my_school_id.value);
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let encrypted = CryptoJS.AES.encrypt(drawerProps.value.row.password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      let encryptedPassword = encrypted.toString();
      const params = JSON.parse(
        JSON.stringify({ ...drawerProps.value.row, password: encryptedPassword, school_id: my_school_id.value })
      );
      console.log(params);
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}账号成功！` });
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
