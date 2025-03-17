<template>
  <el-dialog
    v-model="modelVisible"
    title="画像管理"
    width="1000"
    center
    modal
    destroy-on-close
    :close-on-click-modal="false"
    @open="init"
  >
    <el-checkbox-group
      v-if="options.length"
      v-model="customerId"
      style="display: flex; flex-wrap: wrap; column-gap: 46.5px; height: 600px; padding: 10px; overflow: scroll"
      @change="handleChange"
    >
      <el-checkbox
        v-for="item in options"
        style="
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 30%;
          height: fit-content;
          padding: 10px;
          margin: 0 !important;
          margin-bottom: 20px;
        "
        :key="item.id"
        :value="item.id"
        border
      >
        <template #default>
          <div style="display: flex; flex-direction: column; gap: 10px; width: 33%; height: fit-content">
            <!-- <img :src="item.avatar" style="width: 150px; height: 150px; border-radius: 75px" alt="" /> -->
            <el-image :src="item.avatar" style="width: 150px; height: 150px; border-radius: 75px" loading="eager" lazy alt="">
              <template #error>
                <div>
                  <ElIcon>
                    <IconPicture style="width: 150px; height: 150px; border-radius: 75px" />
                  </ElIcon>
                </div>
              </template>
            </el-image>
            <span>姓名：{{ item.name.split("（")[0] }}</span>
            <span>相关：{{ (item.name.split("（")[1] || "暂无").replace("）", "") }}</span>
            <span>难度：{{ item.difficulty }}</span>
            <span>性别：{{ item.gender === "Male" ? "男" : "女" }}</span>
          </div>
        </template>
      </el-checkbox>
    </el-checkbox-group>
    <el-empty v-else :image-size="200" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="modelVisible = false">取消</el-button>
        <el-button v-loading="loading" type="primary" @click="handleSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SuperCustomerManage">
import { Group } from "@/api/interface";
import { get_group_customer, getGroupCustomerListByGroupId } from "@/api/modules/custom";
import { computed, ref } from "vue";
import { Customer } from "./GroupDrawer.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { updateGroup } from "@/api/modules/groups";
import { Picture } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/modules/auth";

const modelVisible = ref<boolean>(false);
export interface PropsParams {
  row: Partial<Group.GroupList>;
  getTableList?: () => void;
}
const propsParams = ref<PropsParams>({
  row: {}
});
const useAuth = useAuthStore();
const isSuper = computed(() => useAuth.isSuper);
const customerId = ref<number[]>([96]);

const handleChange = () => {
  console.log(customerId.value);
};

const loading = ref(false);

const options = ref([]);

const init = async () => {
  const getData = isSuper.value ? get_group_customer : getGroupCustomerListByGroupId;
  const params = isSuper.value ? {} : { id: propsParams.value.row.id };
  getData(params).then(({ data }) => {
    options.value = isSuper.value ? data.list : data.customers;
  });
};
const acceptParams = (params: PropsParams) => {
  modelVisible.value = true;
  propsParams.value = params;
  customerId.value = propsParams.value.row.available_customers?.split(",").map(Number) || [];
};

const handleSubmit = () => {
  // propsParams.value.row = { ...propsParams.value.row, available_customers: customerId.value.join(",") };

  ElMessageBox.confirm(`是否修改该组别可用画像?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true
  }).then(async () => {
    loading.value = true;
    const res = await updateGroup({ available_customers: customerId.value, id: propsParams.value.row.id });
    if (!res) {
      loading.value = false;
      ElMessage.error(res.msg);
      modelVisible.value = false;
    }
    ElMessage({
      type: "success",
      message: `修改成功!`
    });
    propsParams.value.getTableList!();
    loading.value = false;
    modelVisible.value = false;
  });
};
defineExpose({ acceptParams });
</script>
<style lang="scss" scoped>
:deep(.el-checkbox) {
  margin: 0 0 20px;
}
:deep(.el-checkbox__label) {
  order: -1;
}
</style>
