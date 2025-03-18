<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}组别`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="组别名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写用组别名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="组别描述" prop="description">
        <el-input v-model="drawerProps.row!.description" placeholder="请填写组别描述" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="drawerProps.isAdd || drawerProps.isView" label="可访问顾客" prop="available_customers">
        <el-select v-model="drawerProps.row!.available_customers" placeholder="请选择可访问顾客" clearable multiple>
          <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.name">
            <template #default>
              <div style="display: flex; gap: 10px; align-items: center">
                <img :src="item.avatar" style="width: 20px; height: 100%" alt="" />
                <div class="name">{{ item.name }}</div>
                <el-tag class="sex">{{ item.gender == "Male" ? "男" : "女" }}</el-tag>
                <div class="difficulty">{{ item.difficulty }}</div>
              </div>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!drawerProps.isAdd" label="邀请码" prop="invite_code">
        <el-input v-model="drawerProps.row!.invite_code" placeholder="请填写邀请码" clearable></el-input>
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
import { Group } from "@/api/interface";
import { get_group_customer } from "@/api/modules/college";
//表单校验规则
const rules = reactive({
  name: [
    { required: true, message: "请填写用户名" },
    { min: 3, max: 16, message: "用户名的长度必须大于3小于16", trigger: "blur" }
  ],
  invite_code: [{ required: true, message: "请填邀请码" }]
});

export interface DrawerProps {
  title: string;
  isView: boolean;
  isAdd: boolean;
  row: Partial<Group.CreateGroup | Group.UpdateGroup>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  isAdd: false,
  title: "",
  row: {}
});

const options = ref<Customer[]>([]);

export interface Customer {
  age_group: string;
  avatar: string;
  ctime: string;
  difficulty: string;
  gender: string;
  id: string;
  name: string;
  practice_count: number;
  router_id: string;
  tag_ids: string;
  utime: string | Date;
}

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  drawerProps.value.row.available_customers = drawerProps.value.row.available_customers?.split(",");
  const {
    data: { list }
  } = await get_group_customer({});
  options.value = list as Customer[];
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}组别成功！` });
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
