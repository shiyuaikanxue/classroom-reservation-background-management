<template>
  <ul v-if="showData" style="width: 100%; max-height: 300px; padding: 0; margin: 0; overflow-y: scroll; list-style: none">
    <li
      v-for="item in data.list"
      :key="item.content"
      style="display: flex; gap: 10px; width: 100%; padding: 10px 0"
      :style="{ justifyContent: item.poster === 'customer' ? 'flex-start' : 'flex-end' }"
    >
      <img
        v-if="item.poster === 'customer'"
        :src="data.customerAvatar"
        alt=""
        style="width: 30px; height: 30px; border-radius: 10%"
      />
      <div
        style="padding: 0"
        :style="{
          backgroundColor: globalStore.primary,
          width: 'fit-content',
          maxWidth: 'calc(100% - 120px)',
          fontSize: '13px',
          padding: '5px 10px',
          lineHeight: '20px',
          borderRadius: '5px',
          textAlign: 'justify'
        }"
      >
        <span :style="{ color: color }">{{ item.content }}</span>
      </div>
      <img v-if="item.poster === 'user'" :src="userAvatar" alt="" style="width: 30px; height: 30px; border-radius: 10%" />
    </li>
  </ul>
  <el-skeleton v-else :rows="5" animated />
</template>

<script setup lang="ts" name="ChatList">
import { Chat } from "@/api/interface";
import { computed, reactive, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useGlobalStore } from "@/stores/modules/global";
export interface MessageObj {
  poster: string;
  content: string;
}
interface DataType {
  list: MessageObj[];
  customerAvatar: string;
}
//列表数据信息
const data = reactive<DataType>({
  list: [],
  customerAvatar: ""
});

const useStore = useUserStore();

const showData = ref<boolean>(false);

const color = computed(() => {
  const bgColorRGB = hexToRgb(globalStore.primary);
  const luminance = getLuminance(bgColorRGB);
  const isWhiteVisible = luminance < 127.5 || luminance > 220;
  return isWhiteVisible ? "white" : "black";
});

const hexToRgb = hex => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
};
const getLuminance = color => {
  let [r, g, b] = color.match(/\d+/g).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const globalStore = useGlobalStore();

//用户头像
const userAvatar = useStore.userInfo.avatar;
const init = (params: { list: MessageObj[]; customerAvatar: string }) => {
  data.list.push(...params.list);
  data.customerAvatar = params.customerAvatar;
  showData.value = true;
};
const close = () => {
  showData.value = false;
};
defineExpose({
  init,
  close
});
</script>
