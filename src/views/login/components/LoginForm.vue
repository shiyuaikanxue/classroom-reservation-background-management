<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入用户名">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL, APP_NAME } from "@/config";
import { getTimeState } from "@/utils";
import { Login } from "@/api/interface";
import { ElMessage, ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import { RoleType } from "@/enums";
import type { ElForm } from "element-plus";
import CryptoJS from "crypto-js";
import { useAuthStore } from "@/stores/modules/auth";
// import md5 from "md5";
const key = CryptoJS.enc.Utf8.parse("y7xHoYB1CKYtj+nR");
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const authStore = useAuthStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: ""
});

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    // try {
    // 1.执行登录接口
    let encrypted = CryptoJS.AES.encrypt(loginForm.password, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    let encryptedPassword = encrypted.toString();
    loginApi({ ...loginForm, password: encryptedPassword })
      .then(async (res: any) => {
        const { admin, token } = res;
        userStore.setToken(token);
        // 2.添加动态路由
        await initDynamicRouter();
        router.push(HOME_URL);
        userStore.setUserInfo(admin);
        authStore.setSuper(admin.role === RoleType.SUPERADMIN);
        // 3.清空 tabs、keepAlive 数据
        tabsStore.setTabs([]);
        keepAliveStore.setKeepAliveName([]);
        ElNotification({
          title: getTimeState(),
          message: "欢迎登录 " + APP_NAME,
          type: "success",
          duration: 3000
        });
      })
      .catch(() => {
        loading.value = false;
      });
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});

onBeforeUnmount(() => {
  document.onkeydown = null;
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
