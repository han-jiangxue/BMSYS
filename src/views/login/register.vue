<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { User, Lock, Key, Message, Avatar } from "@element-plus/icons-vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { type FormInstance, FormRules } from "element-plus"
import { getEmailCodeApi } from "@/api/login"
import { type RegisterParams } from "@/api/login/types/login"

const router = useRouter()
const registerFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)
/** 注册表单数据 */
const registerForm: RegisterParams = reactive({
  idCardNumber: "",
  password: "",
  realName: "",
  email: "",
  code: "",
  newPassword: ""
})
/** 登录表单校验规则 */
const registerFormRules: FormRules = {
  idCardNumber: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    { min: 15, max: 18, message: "长度在 15 到 18 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
}
/** 登录逻辑 */
const handleLogin = () => {
  registerFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login({
          idCardNumber: registerForm.idCardNumber,
          password: registerForm.password,
          code: registerForm.code
        })
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          registerForm.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      return false
    }
  })
}

const getEmailCode = async () => {
  await getEmailCodeApi({ email: registerForm.email })
}
</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div class="login-card">
      <div class="title">
        <img width="60" src="@/assets/layout/CUMT.png" />
        <span class="font-800 text-6 ml">中国矿业大学辅导员报名系统</span>
      </div>
      <div class="content">
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model.trim="registerForm.idCardNumber"
              placeholder="请输入身份证号码"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="realName">
            <el-input
              v-model.trim="registerForm.realName"
              placeholder="请输入真实姓名"
              type="text"
              tabindex="2"
              :prefix-icon="Avatar"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="registerForm.password"
              placeholder="请输入密码"
              type="password"
              tabindex="3"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="registerForm.newPassword"
              placeholder="请再次输入密码"
              type="password"
              tabindex="3"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model.trim="registerForm.email"
              placeholder="邮箱"
              type="text"
              tabindex="4"
              :prefix-icon="Message"
              size="large"
            >
              <template #append>
                <el-button
                  type="success"
                  class="w-20! bg-blue! my-0! p-0! mx-2! color-#FFF! font-600!"
                  @click="getEmailCode"
                  >发送验证码</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model.trim="registerForm.code"
              placeholder="请输入邮箱验证码"
              type="text"
              tabindex="5"
              :prefix-icon="Key"
              size="large"
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin"> 注 册 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
