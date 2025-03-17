<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="title" @close="handleClose">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :disabled="true" :model="data.row">
      <el-form-item label="客户姓名" prop="customer_name">
        <el-input v-model="data.row!.customer_name"></el-input>
      </el-form-item>
      <el-form-item label="客户头像" prop="avatar">
        <UploadImg :api="uploadAvatar" v-model:image-url="data.row!.avatar" width="135px" height="135px" :file-size="3">
        </UploadImg>
      </el-form-item>
      <el-form-item label="开始时间" prop="ctime">
        <el-date-picker v-model="data.row!.ctime" type="datetime" />
      </el-form-item>
      <el-form-item label="结束时间" prop="utime">
        <el-date-picker v-model="data.row!.utime" type="datetime" />
      </el-form-item>
      <el-form-item label="对话" prop="content"> <ChatList ref="chatList"></ChatList> </el-form-item>
      <el-form-item label="会话评价" prop="comment"> <Comment ref="commentRef"></Comment></el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getChatDetail, getChatHistory, getChatHistorySuggestion } from "@/api/modules/chat";
import { uploadAvatar } from "@/api/modules/user";
import ChatList, { MessageObj } from "@/views/proTable/components/ChatList.vue";
import Comment from "./Comment.vue";
import UploadImg from "@/components/Upload/Img.vue";
import { Chat } from "@/api/interface";
const drawerVisible = ref<boolean>(false);

const title = ref("");

interface DrawerProps {
  row: Partial<Chat.ChatList>;
  chat_history: MessageObj[]; //对话记录
}
//会话列表
const chatList = ref<InstanceType<typeof ChatList> | null>(null);
//会话评价
const commentRef = ref<InstanceType<typeof Comment> | null>(null);

const data = reactive<DrawerProps>({
  row: {},
  chat_history: []
});
//获取对话列表
async function getHistory(row: Chat.ChatList) {
  const params = {
    url: row.whole_conversation_text
  };
  return getChatHistory(params);
}
//获取评价建议
async function getComment(row: Chat.ChatList) {
  const params = {
    url: row.whole_conversation_text
  };
  return getChatHistorySuggestion(params);
}

//初始化
const init = async (propsTitle: string, row: Chat.ChatList) => {
  title.value = propsTitle;
  data.row = row;
  drawerVisible.value = true;
  Reflect;
  const history = await getHistory(row);
  data.chat_history = history.data.chat_history.reduce((res: MessageObj[], cur) => {
    const { customer, user } = cur;
    res.push({
      poster: "user",
      content: user
    });
    res.push({
      poster: "customer",
      content: customer
    });

    return res;
  }, []);
  chatList.value?.init({ list: data.chat_history, customerAvatar: row.avatar });
  const comment = await getComment(row);
  commentRef.value?.init(comment.data.llm_suggestion);
};

const handleClose = () => {
  chatList.value?.close();
};
defineExpose({ init });
</script>
