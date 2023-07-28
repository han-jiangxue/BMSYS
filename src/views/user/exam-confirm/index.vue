<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { examConfirmApi, examCancelApi } from "@/api/user/exam-confirm"
import { getRegistrationStatueApi } from "@/api/user/add-info"
import { getExamTaskAPI } from "@/api/user/exam-confirm"
import { ElMessage } from "element-plus"
import { useRouter } from "vue-router"

const router = useRouter()

interface registerStatueType {
  attachmentPath: string
  cancelReason: string
  createTime: string
  examInfoId: string
  examStatus: number
  reviewStatus: number
  fillingStatus: number
  fillingDate: string
  photoPath: string
  userId: string
  hasAttachment: boolean
  hasPhoto: boolean
}

const dialogVisible = ref({
  isDialogVisible: true,
  confirmDialogVisible: false,
  cancelDialogVisible: false
})
const cancelReason = ref("")
const registerStatue = ref<registerStatueType>()
const examTask = ref()

const handleConfirm = async () => {
  await examConfirmApi().then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("已确认参加考试")
      setTimeout(() => {
        router.push({ path: "/dashboard" })
      }, 2000)
    } else {
      ElMessage.warning(res.message)
    }
  })
}

const handleCancel = async () => {
  if (!cancelReason.value) {
    ElMessage.warning("请输入原因")
    return
  }
  await examCancelApi({ reason: cancelReason.value }).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("已取消参加考试")
      setTimeout(() => {
        router.push({ path: "/dashboard" })
      }, 2000)
    } else {
      ElMessage.warning(res.message)
    }
  })
}

function getExamStatusStatusLabel(taskStatus: any) {
  const statusMap: { [key: string]: string } = {
    1: "未确认",
    2: "已确认",
    3: "已取消",
    4: ""
  }
  return statusMap[taskStatus as number] || "未知状态"
}

onMounted(async () => {
  await getRegistrationStatueApi().then((res: any) => {
    registerStatue.value = res.data
  })
  await getExamTaskAPI().then((res: any) => {
    if (res.code === 200) {
      examTask.value = res.data
    }
  })
  if (registerStatue.value?.reviewStatus !== 3) {
    ElMessage.warning("填报审核通过后方可进入")
    setTimeout(() => {
      router.push({ path: "/dashboard" })
    }, 2000)
  }
})
</script>

<template>
  <div class="app-container">
    <div class="h-80vh flex justify-between items-center">
      <div
        class="h-full flex justify-center flex-col items-center rounded-8 relative overflow-hidden"
        style="box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff"
      >
        <div class="absolute flex justify-center w-64 h-64 rounded-full top--32 right--32 bg-#4076B1">
          <div class="ml--28 flex justify-center items-center mt-28 font-800 text-5 color-#FFF">
            {{ getExamStatusStatusLabel(registerStatue?.examStatus) || "状态未知" }}
          </div>
        </div>
        <div class="font-800 text-6 mb--6">考试确认</div>
        <img src="../../../assets//user/confirm.gif" alt="GIF 图片" class="w-100 mb--8" />
        <div class="color-black color-blue">请在规定时间内进行确认</div>
        <div class="mt-4 text-slate-500">开始时间：{{ examTask?.startTime || "暂无数据" }}</div>
        <div class="my-1 text-slate-500">截至时间：{{ examTask?.endTime || "暂无数据" }}</div>
      </div>
      <div
        class="h-full w-60vw flex justify-center flex-col items-center rounded-4 mx-8"
        style="box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff"
      >
        <img src="../../../assets//user/choose.gif" alt="GIF 图片" />
        <div class="mt-4">请选择是否参加考试，取消考试需要填写理由</div>
        <div class="mt-4">（注意：一旦取消不可再参加本次考试）</div>
        <div class="flex justify-center mt-6">
          <el-button type="danger" @click="dialogVisible.cancelDialogVisible = true" class="mr-16">取消考试</el-button>
          <el-button type="primary" @click="dialogVisible.confirmDialogVisible = true">确认考试</el-button>
        </div>
      </div>

      <!-- <el-dialog v-model="dialogVisible.isDialogVisible" title="考试确认" draggable width="40%" center>
        <template #footer>
          <el-button @click="dialogVisible.cancelDialogVisible = true" class="mr-16">取消考试</el-button>
          <el-button type="primary" @click="dialogVisible.confirmDialogVisible = true">确认考试</el-button>
        </template>
      </el-dialog> -->
      <el-dialog v-model="dialogVisible.confirmDialogVisible" title="提示" draggable width="30%" center>
        <div class="flex w-full justify-center items-center flex-col font-600">
          <div>请问是否确认参加考试？</div>
          <div class="mt-4">祝愿您顺顺利利，平安喜乐加油ヾ(◍°∇°◍)ﾉﾞ</div>
        </div>
        <template #footer>
          <el-button class="mr-16" @click="dialogVisible.confirmDialogVisible = false">我再想想</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogVisible.cancelDialogVisible" title="提示" draggable width="30%" center>
        <div class="mb-4">请问是否取消考试？取消后本次招聘不可再次参加考试！</div>
        <el-form-item label="取消原因">
          <el-input v-model="cancelReason" placeholder="请输入取消考试原因" clearable />
        </el-form-item>
        <template #footer>
          <el-button type="primary" @click="handleCancel">确认取消考试</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
  <!-- <div class="h-full flex justify-center items-center">
    <el-dialog v-model="dialogVisible.isDialogVisible" title="考试确认" draggable width="40%" center>
      <template #footer>
        <el-button @click="dialogVisible.cancelDialogVisible = true" class="mr-16">取消考试</el-button>
        <el-button type="primary" @click="dialogVisible.confirmDialogVisible = true">确认考试</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible.confirmDialogVisible" title="提示" draggable width="30%" center>
      <div>请问是否参加考试？</div>
      <template #footer>
        <el-button class="mr-16" @click="dialogVisible.confirmDialogVisible = false">我再想想</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible.cancelDialogVisible" title="提示" draggable width="30%" center>
      <div class="mb-4">请问是否取消考试？取消后本次招聘不可再次参加考试！</div>
      <el-form-item label="取消原因">
        <el-input v-model="cancelReason" placeholder="请输入取消考试原因" clearable />
      </el-form-item>
      <template #footer>
        <el-button type="primary" @click="handleCancel">确认取消考试</el-button>
      </template>
    </el-dialog>
  </div> -->
</template>
