<template>
  <div style="padding: 10px 0" v-for="item in data.dimensions" :key="item.detail">
    <el-descriptions direction="vertical" :column="2" border>
      <el-descriptions-item label="描述" span="2" min-width="305" label-align="center">
        {{ item.detail }}
      </el-descriptions-item>
      <el-descriptions-item label="总结">{{ item.dimension }}</el-descriptions-item>
      <el-descriptions-item label="分数" align="center">
        <span :style="{ color: globalStore.primary }">{{ item.score }}</span>
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <el-descriptions :column="1" border>
    <el-descriptions-item label="建议">{{ data.suggestions || "暂无建议" }}</el-descriptions-item>
    <el-descriptions-item label="总分">
      <span style="font-weight: bold" :style="{ color: globalStore.primary }">
        {{ data.total_score }}
      </span>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts" name="Comment">
import { Chat } from "@/api/interface";
import { useGlobalStore } from "@/stores/modules/global";
import { reactive } from "vue";

const globalStore = useGlobalStore();

//列表数据信息
const data = reactive<Chat.CommentDetail>({
  dimensions: [],
  suggestions: "",
  total_score: 0
});
const init = (row: Chat.CommentDetail) => {
  if (row) {
    data.dimensions = row.dimensions;
    data.suggestions = row.suggestions;
    data.total_score = row.total_score;
    console.log(data, "==========================");
  }
};
const close = () => {};
defineExpose({
  init
});
</script>
