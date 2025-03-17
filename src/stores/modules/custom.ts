import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "custom",
  state: () => ({}),
  getters: {},
  actions: {},
  persist: piniaPersistConfig("custom")
});
