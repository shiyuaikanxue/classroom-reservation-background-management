<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}教室`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="教室号" prop="code">
        <el-input v-model="drawerProps.row!.code" placeholder="请填教室号" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属学院" prop="college_id">
        <el-select v-model="drawerProps.row!.college_id" placeholder="请选择所属学院" clearable>
          <el-option v-for="item in college_list" :key="item.name" :label="item.name" :value="item.college_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教室容量" prop="capacity">
        <el-input-number v-model="drawerProps.row!.capacity" placeholder="请选择教室容量" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="教室位置" prop="location">
        <el-input v-model="drawerProps.row!.location" placeholder="请填教室位置" clearable></el-input>
      </el-form-item>
      <el-form-item label="教室设备" prop="equipment">
        <el-select v-model="drawerProps.row!.equipment" placeholder="请选择教室设备" clearable multiple>
          <el-option
            v-for="(item, index) in ClassroomEquipmentsOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="drawerProps.row!.status" placeholder="请选择教室状态" clearable>
          <el-option
            v-for="(item, index) in ClassroomStatusOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="桌子数量" prop="desk_capacity">
        <el-input-number v-model="drawerProps.row!['desk_capacity']" placeholder="请选择教室设备" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="空调数量" prop="air_conditioner_count">
        <el-input-number
          v-model="drawerProps.row!['air_conditioner_count']"
          placeholder="请选择教室设备"
          clearable
        ></el-input-number>
      </el-form-item>
      <el-form-item label="是否配备多媒体设备" prop="multimedia_equipment">
        <el-switch v-model="drawerProps.row!['multimedia_equipment']" placeholder="请选择教室设备" clearable></el-switch>
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
import { ClassroomEquipmentsOptions, ClassroomStatusOptions } from "@/views/classroom/constants";
//表单校验规则
const rules = reactive({
  code: [{ required: true, message: "请输入教室号", trigger: "blur" }],
  college_id: [{ required: true, message: "请选择所属学院", trigger: "blur" }],
  capacity: [{ required: true, message: "请输入教室容量", trigger: "blur" }],
  location: [{ required: true, message: "请输入教室位置", trigger: "blur" }],
  status: [{ required: true, message: "请输入教室状态", trigger: "blur" }],
  desk_capacity: [{ required: true, message: "请输入教室桌子数量", trigger: "blur" }],
  air_conditioner_count: [{ required: true, message: "请输入教室空调数量", trigger: "blur" }],
  multimedia_equipment: [{ required: true, message: "请输入教室是否配备多媒体设备", trigger: "blur" }]
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
  drawerProps.value.row = {
    ...drawerProps.value.row,
    equipment: drawerProps.value.row?.equipment ? drawerProps.value.row?.equipment.split(",") : [],
    multimedia_equipment: drawerProps.value.row?.multimedia_equipment === "1" ? true : false
  };
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = JSON.parse(JSON.stringify(drawerProps.value.row));
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value?.title}教室成功！` });
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
