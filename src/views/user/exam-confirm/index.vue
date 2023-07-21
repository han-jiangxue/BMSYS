<script lang="ts" setup>
import { ref } from "vue"
import { examConfirmApi, examCancelApi } from "@/api/user/exam-confirm"
import { ElMessage } from "element-plus"
import { useRouter } from "vue-router"

const router = useRouter()

const dialogVisible = ref({
  isDialogVisible: true,
  confirmDialogVisible: false,
  cancelDialogVisible: false
})
const cancelReason = ref("")

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
</script>

<template>
  <div class="h-full flex justify-center items-center">
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
  </div>
</template>
