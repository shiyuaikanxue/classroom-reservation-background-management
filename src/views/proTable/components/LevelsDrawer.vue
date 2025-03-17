<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}等级`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写用等级名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="等级描述" prop="description">
        <el-input v-model="drawerProps.row!.description" placeholder="请填写等级描述" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="drawerProps.isView || drawerProps.isEdit" label="可用画像" prop="customer_ids">
        <el-select
          v-model="drawerProps.row!.customer_ids"
          :loading="customer_idsLoading"
          placeholder="请选择可访问顾客"
          clearable
          multiple
        >
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
      <el-form-item label="所属部门" prop="group_id">
        <el-select
          v-model="drawerProps.row!.group_id"
          :loading="group_idLoading"
          :disabled="drawerProps.isEdit"
          placeholder="请选择所属部门"
          clearable
        >
          <el-option v-for="item in Groups" :key="item.id" :value="item.id" :label="item.name">
            <template #default>
              <div style="display: flex; gap: 10px; align-items: center">
                <div class="name">{{ item.name }}</div>
                <div class="difficulty">{{ item.id }}</div>
              </div>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认等级" prop="default">
        <el-switch v-model="drawerProps.row.default" :active-icon="Check" :inactive-icon="Close" />
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
import { Check, Close } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
import { Group, Levels } from "@/api/interface";
import { get_group_customer, getGroupCustomerListByGroupId } from "@/api/modules/custom";
import { getGroupDetail, getGroupList } from "@/api/modules/groups";
//表单校验规则
const rules = reactive({
  name: [
    { required: true, message: "请填写用户名" },
    { min: 3, max: 16, message: "用户名的长度必须大于3小于16", trigger: "blur" }
  ],
  group_id: [{ required: true, message: "请选择所属部门" }]
});

export interface DrawerProps {
  title: string;
  isAdd: boolean;
  isView: boolean;
  isEdit: boolean;
  row: Partial<Levels.CreateLevel>;
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

const options = ref<Customer[]>([]);
const customer_idsLoading = ref<boolean>(false);
const Groups = ref<Group.GroupList[]>([]);
const group_idLoading = ref<boolean>(false);
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

const init = async () => {
  if (drawerProps.value.isAdd) {
    const {
      data: { groups }
    } = await getGroupList({}, false);
    Groups.value = groups;
  }
  if (drawerProps.value.isEdit) {
    // const {
    //   data: { list }
    // } = await get_group_customer({});
    const {
      data: { customers }
    } = await getGroupCustomerListByGroupId({ id: drawerProps.value.row.group_id }, false);
    const {
      data: {
        group: { available_customers }
      }
    } = await getGroupDetail({ id: drawerProps.value.row.group_id as string }, false);
    const limit = available_customers.split(",");
    options.value = customers.filter(item => {
      return limit.includes(item.id + "");
    });
  }
};

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;

  drawerProps.value.row.customer_ids = (drawerProps.value.row.customer_ids as string)?.split(",");

  drawerVisible.value = true;
  init();
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = JSON.parse(JSON.stringify(drawerProps.value.row));
      if (drawerProps.value.isEdit) {
        delete params.ctime;
        delete params.utime;
        delete params.group_id;
      }
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}等级成功！` });
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
