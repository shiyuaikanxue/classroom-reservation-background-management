import { Chat, ResPage } from "@/api/interface/index";
import { PORT2 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 会话管理模块
 */
// 获取会话列表
export const getChatList = (params: Chat.GetChatList) => {
  return http.post<ResPage<Chat.ChatList>>(PORT2 + `/chats/chat_with_customer/list`, params);
};

// 获取会话详情
export const getChatDetail = (params: { id: string }) => {
  return http.get<ResPage<Chat.ChatList>>(PORT2 + `/chats/${params.id}`);
};

// 删除会话
export const deleteChat = (params: { id: string }) => {
  return http.delete<ResPage<Chat.ChatList>>(PORT2 + `/chats/${params.id}`);
};

// 创建会话
export const createChat = (params: Chat.createChatInfo) => {
  return http.post<ResPage<Chat.ChatList>>(PORT2 + `/chats/create`, params);
};

// 更新会话
export const updateChat = (params: Chat.updateChatInfo) => {
  return http.put<ResPage<Chat.ChatList>>(PORT2 + `/chats/create`, params);
};

// 读取会话历史
export const getChatHistory = (params: { url: string }) => {
  return http.post<Chat.HistoryResponse>(PORT2 + `/chats/chat_history`, params);
};

// 读取会话历史建议
export const getChatHistorySuggestion = (params: { url: string }) => {
  return http.post<Chat.CommnetResponse>(PORT2 + `/chats/chat_suggestion`, params);
};
