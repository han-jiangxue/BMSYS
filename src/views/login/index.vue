<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { type FormInstance, FormRules } from "element-plus"
import { getLoginCodeApi, getPublicKeyApi } from "@/api/login"
import { rsaEncrypt } from "@/utils/encrypt"
import { type LoginRequestData } from "@/api/login/types/login"

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)
const preloadedImages = ref<Array<HTMLImageElement>>([])
const publicKey = ref("")
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
/** 验证码图片 URL */
const codeUrl = ref()
/** 登录表单数据 */
const loginForm: LoginRequestData = reactive({
  idCardNumber: "",
  password: "",
  rememberMe: true,
  code: ""
})
/** 登录表单校验规则 */
const loginFormRules: FormRules = {
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
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login({
          idCardNumber: loginForm.idCardNumber,
          password: rsaEncrypt(publicKey.value, loginForm.password),
          rememberMe: loginForm.rememberMe,
          publicKey: publicKey.value,
          code: loginForm.code,
          uuid: loginForm.uuid
        })
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          createCode()
          loginForm.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      return false
    }
  })
}
/** 创建验证码 */
const createCode = () => {
  // 先清空验证码的输入
  loginForm.code = ""
  // 获取验证码
  codeUrl.value = ""
  getLoginCodeApi().then((res) => {
    codeUrl.value = `data:image/jpeg;base64,${res.data.image}`
    loginForm.uuid = res.data.uuid as string
  })
}

const handleRegister = () => {
  router.push({ path: "/register" })
}

const handleResetPassword = () => {
  router.push({ path: "/reset-password" })
}

/** 初始化验证码 */
createCode()

onMounted(async () => {
  preloadImages()
  startImageTransition()
  await getPublicKeyApi().then((res: any) => {
    if (res.code === 200) {
      publicKey.value = res.data.publicKey
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
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" @keyup.enter="handleLogin">
            <el-form-item prop="username">
              <el-input
                v-model.trim="loginForm.idCardNumber"
                placeholder="请输入身份证号"
                type="text"
                tabindex="1"
                :prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model.trim="loginForm.password"
                placeholder="密码"
                type="password"
                tabindex="2"
                :prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                v-model.trim="loginForm.code"
                placeholder="验证码"
                type="text"
                tabindex="3"
                :prefix-icon="Key"
                maxlength="7"
                size="large"
              >
                <template #append>
                  <el-image :src="codeUrl" @click="createCode" draggable="false">
                    <template #placeholder>
                      <el-icon><Picture /></el-icon>
                    </template>
                    <template #error>
                      <el-icon><Loading /></el-icon>
                    </template>
                  </el-image>
                </template>
              </el-input>
            </el-form-item>
            <div class="h-4 px-6 flex items-center justify-between text-3 font-600">
              <div class="hover:color-blue cursor-pointer underline" @click="handleResetPassword">忘记密码</div>
              <div class="hover:color-blue cursor-pointer underline" @click="handleRegister">注册新用户</div>
            </div>
            <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin"> 登 录 </el-button>
          </el-form>
        </div>
      </div>
      <div class="fixed left-5% bottom-5% color-#5786BA text-5">
        <div>意见反馈邮箱：fdycumt@163.com</div>
        <div>工作单位：中国矿业大学党委学生工作部</div>
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
