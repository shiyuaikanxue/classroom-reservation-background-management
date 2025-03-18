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
      <el-form-item label="校名" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写学校名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="drawerProps.row!.type" placeholder="请选择学校类型" clearable>
          <el-option v-for="item in SchoolsTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="所在国家" prop="country">
        <el-select v-model="drawerProps.row.country" filterable placeholder="请选择所在国家" @change="onCountryChange">
          <el-option v-for="country in countries" :key="country.value" :label="country.label" :value="country.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市" prop="city">
        <el-select v-model="drawerProps.row.city" filterable placeholder="请选择学校城市">
          <el-option v-for="city in currentCities" :key="city.value" :label="city.label" :value="city.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请填写学校地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contact">
        <el-input v-model="drawerProps.row!.contact" placeholder="请填写联系电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="官网" prop="website">
        <el-input v-model="drawerProps.row!.website" placeholder="请填写官网" clearable></el-input>
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
import { Group, Schools } from "@/api/interface";
import { cities, countries } from "@/enums/countryEnum";
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "请填写学校名称" }],
  type: [{ required: true, message: "请选择所属部门" }],
  contact: [
    {
      pattern: /^[\d\-+()（）\s]{5,20}$/,
      message: "请输入有效的电话号码",
      trigger: "blur"
    }
  ],
  email: [
    {
      type: "email",
      message: "请输入有效的邮箱地址",
      trigger: "blur"
    }
  ],
  website: [
    {
      pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: "请输入有效的网址",
      trigger: "blur"
    }
  ]
});

export interface DrawerProps {
  title: string;
  isAdd: boolean;
  isView: boolean;
  isEdit: boolean;
  row: Partial<Schools.CreateSchool>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
// 当前选中国家对应的城市列表
const currentCities = ref<{ value: string; label: string }[]>([]);

// 国家选择改变时的处理函数
const onCountryChange = (countryCode: string) => {
  currentCities.value = (cities[countryCode] || []).map(c => {
    return { value: c, label: c };
  });
  // 当国家改变时，清空城市选择
  drawerProps.value.row.city = "";
};
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
      const params = JSON.parse(JSON.stringify(drawerProps.value.row));
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}学校成功！` });
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
