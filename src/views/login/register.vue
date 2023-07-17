<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { User, Lock, Key, Message, Avatar } from "@element-plus/icons-vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { type FormInstance, FormRules, ElMessage } from "element-plus"
import { getEmailCodeApi, registerApi, getPublicKeyApi } from "@/api/login"
import { type RegisterParams } from "@/api/login/types/login"
import { rsaEncrypt } from "@/utils/encrypt"

const router = useRouter()
const registerFormRef = ref<FormInstance | null>(null)
const preloadedImages = ref<Array<HTMLImageElement>>([])
const imgLists = [
  "https://www.cumt.edu.cn/_upload/article/images/3a/d1/7adb0a18490496898ac507219537/6b22aff9-552d-45d4-9eec-148f29f4a3d5.jpg",
  "https://www.cumt.edu.cn/_upload/article/images/9c/a8/9da085a548b9a3121a9318a71927/700b95a5-342e-4f99-b1eb-90c33f359980.jpg",
  "https://www.cumt.edu.cn/_upload/article/images/3a/d1/7adb0a18490496898ac507219537/0013b074-ae4a-478b-b9e0-58fd09f673bd.jpg",
  "https://www.cumt.edu.cn/_upload/article/images/9f/71/47e2e69b4d8a9832d93d4a71fe18/a3c648ad-99c2-4f46-88e3-76a947dab64a.jpg"
]
const imageUrl = ref(imgLists[0])
let currentImageIndex = 0
let intervalId: ReturnType<typeof setInterval> | null = null

/** 登录按钮 Loading */
const loading = ref(false)
/** 注册表单数据 */
const registerForm: RegisterParams = reactive({
  idCardNumber: "",
  password: "",
  realName: "",
  email: "",
  code: "",
  newPassword: "",
  publicKey: ""
})
/** 登录表单校验规则 */
const registerFormRules: FormRules = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  idCardNumber: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    { min: 15, max: 18, message: "长度在 15 到 18 个字符", trigger: "blur" }
  ],
  newPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  realName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }]
}
/** 注册逻辑 */
const handleRegister = () => {
  registerFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      if (registerForm.password !== registerForm.newPassword) {
        ElMessage.warning("请确保两次密码一致")
        return
      }
      registerForm.password = rsaEncrypt(registerForm.publicKey, registerForm.password)
      registerApi(registerForm, {
        code: `${registerForm.code}/${registerForm.email}`
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
  if (!registerForm.email) {
    ElMessage.warning("请输邮箱")
    return
  }
  await getEmailCodeApi({ email: registerForm.email }).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("已发送验证码")
    }
  })
}

onMounted(async () => {
  preloadImages()
  startImageTransition()
  await getPublicKeyApi().then((res: any) => {
    if (res.code === 200) {
      registerForm.publicKey = res.data.publicKey
    }
  })
})
onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

async function preloadImages() {
  for (const imageUrl of imgLists) {
    const image = new Image()
    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = reject
      image.src = imageUrl
    })
    preloadedImages.value.push(image)
  }
}

function startImageTransition() {
  intervalId = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % imgLists.length
    imageUrl.value = imgLists[currentImageIndex]
  }, 3000)
}
</script>

<template>
  <transition name="fade">
    <div class="login-container" :style="{ backgroundImage: `url(${imageUrl})` }">
      <ThemeSwitch class="theme-switch" />
      <div class="bg-card" :style="{ backgroundImage: `url(${imageUrl})` }" />
      <div class="login-card">
        <div class="title">
          <img width="60" src="@/assets/layout/CUMT.png" />
          <span class="font-800 text-6 ml">中国矿业大学辅导员报名系统</span>
        </div>
        <div class="content">
          <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" @keyup.enter="handleRegister">
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
            <el-button :loading="loading" type="primary" size="large" @click.prevent="handleRegister">
              注 册
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.login-container {
  will-change: opacity;
  background-repeat: no-repeat;
  background-size: cover;
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
  .bg-card {
    background-repeat: no-repeat;
    background-size: cover;
    width: 480px;
    height: 320px;
    margin-right: 20px;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
