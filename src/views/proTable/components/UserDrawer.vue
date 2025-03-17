<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item v-if="showTotal" label="用户头像" prop="avatar">
        <UploadImg :api="uploadAvatar" v-model:image-url="drawerProps.row!.avatar" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传头像</span>
          </template>
          <template #tip> 头像大小不能超过 3M </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="drawerProps.row!.name" :disabled="showTotal" placeholder="请填写用户名" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="!drawerProps.isView" label="密码" prop="password">
        <el-input v-model="drawerProps.row!.password" placeholder="请填写密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="管理员身份" prop="role">
        <el-select v-model="drawerProps.row!.role" placeholder="请选择用户名" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="drawerProps.isRegister" label="手机号码" prop="phone_number">
        <el-input v-model="drawerProps.row!.phone_number" placeholder="请填写手机号码" clearable></el-input>
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
import { genderType } from "@/utils/dict";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import { uploadAvatar } from "@/api/modules/user";
import UploadImg from "@/components/Upload/Img.vue";
// import UploadImgs from "@/components/Upload/Imgs.vue";
//手机号校验
const checkAge = (rule: any, value: any, callback: any) => {
  if (!value.match(/^1[3-9]\d{9}$/)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
};
const rules = reactive({
  // avatar: [{ required: true, message: "请上传用户头像" }],
  name: [
    { required: true, message: "请填写用户名" },
    { min: 3, max: 16, message: "用户名的长度必须大于3小于16", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请填写密码" },
    { min: 6, max: 20, message: "密码的长度必须大于6小于20", trigger: "blur" }
  ],
  // role: [{ required: true, message: "请选择用户身份" }],
  phone_number: [
    { required: true, message: "请填写手机号码" },
    { validator: checkAge, trigger: "blur" }
  ]
});

//管理员身份字典
const options = [
  {
    value: "normal",
    label: "普通用户"
  },
  {
    value: "admin",
    label: "管理员"
  },
  {
    value: "superadmin",
    label: "超级管理员"
  }
];

//判断是否是编辑或者查看详情，以展示所有信息
const showTotal = ref<boolean>(false);

interface DrawerProps {
  title: string;
  isView: boolean;
  isRegister: boolean;
  row: Partial<User.ResUserList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  isRegister: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps, isSHowTotal = false) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  showTotal.value = isSHowTotal;
  if (isSHowTotal) {
    rules.password = [];
  }
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      //新增和编辑可能需要的字段
      let params = {
        id: drawerProps.value.row.id,
        password: drawerProps.value.row.password,
        avatar: drawerProps.value.row.avatar,
        role: drawerProps.value.row.role,
        name: drawerProps.value.row.name,
        phone_number: drawerProps.value.row.phone_number
      };
      //新增不需要id且无法规定头像
      if (!showTotal.value) {
        delete params.avatar;
        delete params.id;
      } else {
        //编辑无法修改手机号码和用户名
        delete params.phone_number;
        delete params.name;
        if (!params.password) delete params.password;
      }
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
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
