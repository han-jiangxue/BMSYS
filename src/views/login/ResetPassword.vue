<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { Lock, Key, Message } from "@element-plus/icons-vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { type FormInstance, FormRules, ElMessage } from "element-plus"
import { getEmailCodeApi, ResetPassword } from "@/api/login"
import { type LogoutParams } from "@/api/login/types/login"

const router = useRouter()
const resetFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)
/** 注册表单数据 */
const resetForm: LogoutParams = reactive({
  password: "",
  email: "",
  code: "",
  newPassword: ""
})
/** 登录表单校验规则 */
const resetFormRules: FormRules = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  newPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }]
}
/** 修改密码逻辑 */
const handleResetPassword = () => {
  resetFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (resetForm.password !== resetForm.newPassword) {
        ElMessage.warning("请确保两次密码一致")
        return
      }
      loading.value = true
      ResetPassword(resetForm, {
        code: `${resetForm.code}/${resetForm.email}`
      })
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success("注册成功")
            setTimeout(() => {
              router.push({ path: "/login" })
            }, 1000)
          }
        })
        .catch(() => {
          resetForm.email = ""
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
  if (!resetForm.email) {
    ElMessage.warning("请输邮箱")
    return
  }
  await getEmailCodeApi({ email: resetForm.email }).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("已发送验证码")
    }
  })
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
        <el-form ref="resetFormRef" :model="resetForm" :rules="resetFormRules" @keyup.enter="handleResetPassword">
          <el-form-item prop="password">
            <el-input
              v-model.trim="resetForm.password"
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
              v-model.trim="resetForm.newPassword"
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
              v-model.trim="resetForm.email"
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
              v-model.trim="resetForm.code"
              placeholder="请输入邮箱验证码"
              type="text"
              tabindex="5"
              :prefix-icon="Key"
              size="large"
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleResetPassword">
            提 交
          </el-button>
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
