<template>
  <el-card style="width: 100%">
    <template #header>
      <div class="card-header">
        <span v-if="params == '编辑'">编辑客户画像 </span>
        <span v-if="params == '查看'">客户详情 </span>
        <span v-if="params == '新增'">新增客户画像 </span>
      </div>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      inline
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <!-- prop="avatar" -->
        <el-form-item label="客户头像" prop="avatar">
          <UploadImg :api="uploadAvatar" v-model:image-url="drawerProps.row!.avatar" width="135px" height="135px" :file-size="3">
            <template #empty>
              <el-icon>
                <Avatar />
              </el-icon>
              <span>请上传头像</span>
            </template>
            <template #tip> 头像大小不能超过 3M </template>
          </UploadImg>
        </el-form-item>
        <el-form-item label="客户信息" v-if="!drawerProps.isView">
          <el-input
            style="width: 600px"
            type="textarea"
            v-model="basic_info"
            placeholder="请填写客户简介"
            :autosize="{ minRows: 6 }"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="客户模版" prop="basic_info" v-if="drawerProps.row!.basic_info">
          <el-input
            style="width: 600px"
            type="textarea"
            v-model="drawerProps.row!.basic_info"
            placeholder="请填写客户简介"
            :autosize="{ minRows: 6 }"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="客户模板" prop="basic_info">
          <el-input
            style="width: 600px"
            type="textarea"
            v-model="drawerProps.row!.basic_info"
            placeholder="请填写客户模板"
            :autosize="{ minRows: 6, maxRows: 6 }"
            clearable
          ></el-input>
        </el-form-item> -->
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户昵称" prop="name">
            <el-input style="width: 200px" v-model="drawerProps.row!.name" placeholder="请填写用户姓名" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="性别" prop="gender">
            <el-select style="width: 100px" v-model="drawerProps.row!.gender" placeholder="请选择性别" clearable>
              <el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="节点数">
            <el-input-number v-model="nodeNum" :min="0" :max="10" @change="handleChangeNodeNum" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="难度" prop="difficulty">
            <el-select style="width: 100px" v-model="drawerProps.row!.difficulty" placeholder="请选择难度" clearable>
              <el-option v-for="item in difficultyDict" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="">
            <view> <el-button type="primary" @click="addNodes">一键生成</el-button></view>
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="节点对话轮数" prop="size">
          <el-input-number v-model="nodeSize" :min="1" :max="5" @change="handleChangeNodeSize" />
        </el-form-item> -->
      </el-row>
    </el-form>
    <view class="node-container" v-if="nodeList.length">
      <view class="left" v-if="params != '查看'">
        <draggable
          v-model="nodeList"
          class="card nodeList"
          item-key="index"
          animation="300"
          chosen-class="chosen"
          force-fallback="true"
          @update:model-value="handleListUpdate"
        >
          <template #item="{ element, index }">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item :name="index" :key="index">
                <template #title>
                  <div class="fx">
                    <el-image
                      style="width: 25px; height: 25px; margin-right: 10px"
                      src="/src/assets/images/tip.png"
                      fit="contain"
                    />
                  </div>
                  <div :id="element.name" style="font-size: 14px">{{ element.name }}</div>
                </template>
                <div class="item">
                  <div style="margin-bottom: 20px">
                    当前节点对话名称 :
                    <el-input
                      v-model="element.name"
                      :disabled="drawerProps.isView"
                      style="width: 240px"
                      placeholder="请填写节点名称"
                      @input="nameInputChange"
                    />
                  </div>
                  <div style="margin-bottom: 20px">
                    <span style="margin-right: 20px">当前节点对话轮数 :</span>
                    <el-input-number
                      v-model="element.chat_limit"
                      :min="1"
                      :max="5"
                      @change="handleChangeNodeSize"
                      :disabled="drawerProps.isView"
                    />
                  </div>
                  <span style="margin-right: 20px">当前节点模板数 :</span>
                  <el-input-number
                    v-model="element.tasks.length"
                    :min="1"
                    :max="5"
                    @change="handleChangeNodeSize"
                    :disabled="drawerProps.isView"
                  />
                </div>
                <div class="nodes">
                  <div v-for="(v, k) in element.tasks" :key="k" class="item">
                    <el-input
                      style="width: 388px"
                      type="textarea"
                      v-model="element.tasks[k]"
                      placeholder="请填写节点信息"
                      :disabled="drawerProps.isView"
                      :autosize="{ minRows: 5, maxRows: 6 }"
                      clearable
                    ></el-input>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </draggable>
      </view>
      <view class="left" v-else>
        <el-card>
          <div v-for="(item, index) in nodeList" :key="index">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item :name="index" :key="index">
                <template #title>
                  <div class="fx">
                    <el-image
                      style="width: 25px; height: 25px; margin-right: 10px"
                      src="/src/assets/images/tip.png"
                      fit="contain"
                    />
                  </div>
                  <div :id="item.name" style="font-size: 14px">{{ item.name }}</div>
                </template>
                <div class="item">
                  <div style="margin-bottom: 20px">
                    当前节点对话名称 :
                    <el-input
                      v-model="item.name"
                      :disabled="drawerProps.isView"
                      style="width: 240px"
                      placeholder="请填写节点名称"
                      @input="nameInputChange"
                    />
                  </div>
                  <div style="margin-bottom: 20px">
                    <span style="margin-right: 20px">当前节点对话轮数 :</span>
                    <el-input-number
                      v-model="item.chat_limit"
                      :min="1"
                      :max="5"
                      @change="handleChangeNodeSize"
                      :disabled="drawerProps.isView"
                    />
                  </div>
                  <span style="margin-right: 20px">当前节点模板数 :</span>
                  <el-input-number
                    v-model="item.tasks.length"
                    :min="1"
                    :max="5"
                    @change="handleChangeNodeSize"
                    :disabled="drawerProps.isView"
                  />
                </div>
                <div class="nodes">
                  <div v-for="(v, k) in item.tasks" :key="k" class="item">
                    <el-input
                      style="width: 388px"
                      type="textarea"
                      v-model="item.tasks[k]"
                      placeholder="请填写节点信息"
                      :disabled="drawerProps.isView"
                      :autosize="{ minRows: 5, maxRows: 6 }"
                      clearable
                    ></el-input>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </view>

      <!-- 右侧的锚点 -->
      <view class="right">
        <el-card class="right-card">
          <el-timeline style="max-width: 600px">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :hollow="activity.hollow"
            >
              <el-anchor :offset="70">
                <el-anchor-link @click.prevent="scrollToAnchor(activity.name)">
                  {{ activity.name }}
                </el-anchor-link>
              </el-anchor>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </view>
    </view>
    <!--  -->
    <template #footer>
      <el-button @click="cancel">返回</el-button>
      <el-button v-show="!drawerProps.isView" :disabled="!nodeList.length" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-card>
</template>

<script setup lang="ts" name="useProTableDetail">
// import { MoreFilled } from "@element-plus/icons-vue";
import { uploadAvatar } from "@/api/modules/user";
import { useRoute, useRouter } from "vue-router";
import draggable from "vuedraggable";
import { ref, reactive } from "vue";
import { genderType, difficultyDict } from "@/utils/dict";
import { ElMessage } from "element-plus";
import { FormInstance } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
// import UploadImgs from "@/components/Upload/Imgs.vue";
import { router_new, update_customer, router_taskClassify, get_router_data } from "@/api/modules/custom";
const router = useRouter();
const route = useRoute();
// // 获取 id
let id = route.params.id;
let { params } = route.query;
// console.log(id);
// console.log(params);
const activeNames = ref([0, 1, 2]);
const nodeNum = ref(3);
const nodeList = ref<any[]>([]);
const activities = ref<any[]>([]);
const drawerProps: any = ref({
  isView: false,
  title: "",
  row: {
    difficulty: "easy"
  } as any
});
let data = {
  title: params,
  isView: params == "查看",
  row: {
    difficulty: "easy",
    gender: "Male"
  },
  api: params === "新增" ? router_new : get_router_data
};
drawerProps.value = data;
if (params == "查看" || params == "编辑") {
  drawerProps.value.api(id).then(res => {
    console.log(`查看`, res);
    if (res.status_code == 1000) {
      const { template_datas, ...obj } = res.data;
      drawerProps.value.row = obj;
      nodeList.value = template_datas;

      console.log(` drawerProps.value`, drawerProps.value.row);
      console.log(` nodeList.value`, nodeList.value);
      refLine();
    }
  });
}
const basic_info = ref("");
const rules = reactive({
  avatar: [{ required: true, message: "请上传客户头像" }],
  name: [{ required: true, message: "请填写客户昵称" }],
  gender: [{ required: true, message: "请选择性别" }],
  basic_info: [{ required: true, message: "请填写客户简介" }],
  num: [{ required: true, message: "请填写节点数" }]
  // size: [{ required: true, message: "请填写节点对话轮数" }]
});

// interface DrawerProps {
//   title: string;
//   isView: boolean;
//   row: any;
//   api?: (params: any) => Promise<any>;
//   getTableList?: () => void;
// }

/* 检测name变化 */
const nameInputChange = () => {
  refLine();
};
/* 增加节点 */
const handleChangeNodeNum = e => {
  if (e > nodeList.value.length) {
    nodeList.value.push({
      name: `新建节点${e} `,
      chat_limit: 3,
      tasks: ["", "", ""]
    });
  } else {
    nodeList.value.pop();
  }
  refLine();
};
const handleChangeNodeSize = e => {
  console.log(`e`, e);
};
/* 生成节点 */
const addNodes = () => {
  console.log(drawerProps.value);
  if (!basic_info.value || basic_info.value == "") {
    return ElMessage.error(`请填写客户简介!`);
  }
  if (!drawerProps.value.row.name || drawerProps.value.row.name == "") {
    return ElMessage.error(`请填写客户昵称!`);
  }
  if (!drawerProps.value.row.gender || drawerProps.value.row.gender == "") {
    return ElMessage.error(`请选择客户性别!`);
  }
  router_taskClassify({
    basic_info: basic_info.value,
    difficulty: drawerProps.value.row.difficulty,
    node_number: nodeNum.value,
    name: drawerProps.value.row.name,
    gender: drawerProps.value.row.gender
  }).then((res: any) => {
    console.log(`router_taskClassify`, res);
    if (res.status_code == 1000) {
      nodeList.value = res.data.data;
      drawerProps.value.row.basic_info = res.data.basic_info;
      refLine();
    } else {
      ElMessage.error(res.message);
    }
  });
  // const { num, size } = toRefs(drawerProps.value.row);
  // nodeNum.value = num.value;
  // nodeSize.value = size.value;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid: any) => {
    // 验证是否有效
    if (!valid) {
      ElMessage.error(`客户信息请填写完整`);
      return; // 在这里返回 void
    }

    // 遍历检查 nodeList
    for (let v of nodeList.value) {
      if (v.name == "") {
        console.log(`v.value`, v);
        ElMessage.error(`节点名称存在为空`);
        return; // 在这里返回 void
      }
    }

    try {
      // 根据条件设置 API
      if (params == "编辑") {
        drawerProps.value.api = update_customer;
      }

      // 调用 API 更新数据
      const res = await drawerProps.value.api!(
        {
          ...drawerProps.value.row,
          template_datas: nodeList.value
        },
        id
      );

      console.log(`res`, res);

      // 判断返回的状态码并作出相应操作
      if (res.status_code == 1000) {
        ElMessage.success(`${params}成功`);
        nodeList.value = [];
        drawerProps.value.row = { difficulty: "easy" };
        ruleFormRef.value?.resetFields(); // 重置表单字段
        router.push({
          path: "/customer/list",
          query: { date: new Date().getTime() }
        });
      } else {
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.log(error);
      ElMessage.error(`发生错误，请稍后重试`);
    }
  });
};
const cancel = () => {
  router.back();
};

const handleChange = () => {};
const handleListUpdate = list => {
  console.log(`handleListUpdate`, list);
  refLine();
};
function refLine() {
  if (!nodeList.value) return;
  nodeNum.value = nodeList.value.length;
  let arr: any[] = [];
  if (nodeList.value) {
    nodeList.value.forEach(element => {
      let obj: any = {
        name: element.name,
        size: "large",
        type: "primary",
        hollow: true
      };
      arr.push(obj);
    });
    activities.value = arr;
  }
}
// refLine();
function scrollToAnchor(anchorId) {
  const element = document.getElementById(anchorId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
</script>
<style scoped lang="scss">
.fx {
  display: flex;
  align-items: center;
}
.nodes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.item {
  margin: 20px;
}
.node-container {
  display: flex;
  width: 100%;
  .left {
    flex: 1;
  }
  .right {
    position: fixed;
    top: 50%;
    right: 20px;
    flex-shrink: 0;
    width: 180px;
    margin-left: 20px;
    transform: translateY(-50%);
  }
}
.nodeList {
  display: flex;
  flex-direction: column;
}
.nodeList-item {
  display: flex;
  flex-wrap: wrap;
}
:deep(.right-card) {
  --el-card-padding: 30px 20px 0 0px;
}
</style>
