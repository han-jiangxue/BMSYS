<script lang="ts" setup>
import { ElMessage, ElMessageBox, ElLoading } from "element-plus"
import { ref, Ref, onMounted } from "vue"
import { getToken } from "@/utils/cache/cookies"
import { confirmUploadApi, getAddTaskApi, getFileApi } from "@/api/user/submit-info"
import { getRegistrationStatueApi } from "@/api/user/add-info"
import { useRouter } from "vue-router"
import Upload from "@/assets/user/upload.svg?component"
import Uploaded from "@/assets/user/uploaded.svg?component"
import { saveAs } from "file-saver"

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

const registerStatue = ref<registerStatueType>()
const addTask = ref()
const isLoaded = ref(false)
const uploadUrl = import.meta.env.VITE_BASE_API + "/file/uploadArchive"
const token = getToken()
// const dialogVisible = ref(true)
const handleBeforeUpload = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    ElMessageBox.confirm("压缩包大小不可超过30MB，支持zip、rar格式，确定上传吗？", "上传确认", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        // 判断文件大小是否超过1MB
        const fileSizeLimit = 30 * 1024 * 1024 // 50MB
        if (file.size > fileSizeLimit) {
          ElMessage({
            type: "warning",
            message: "文件大小超过30MB，请选择文件大小不超过30MB的压缩包。"
          })
          reject() // 拒绝Promise，阻止上传
          return
        }

        // 用户点击确认且文件大小符合要求，执行上传操作
        resolve() // 解析Promise，允许上传
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "已取消上传"
        })
        reject() // 拒绝Promise，阻止上传
      })
  })
}

const loadingInstance: Ref<any> = ref(null)
const handleProgress = () => {
  loadingInstance.value = ElLoading.service({
    text: `正在上传文件，请稍候`,
    lock: true,
    background: "rgba(0, 0, 0, 0.7)"
  })
}

const handleSuccess = (res: any) => {
  if (res.code === 200) {
    ElMessage.success("上传成功！")
  } else {
    ElMessage.error(res.message + "，上传失败！")
  }
  if (loadingInstance.value) {
    loadingInstance.value.close() // 关闭加载状态
  }
}

const handleError = (error: Error) => {
  ElMessage.error("上传文件出错")
  loadingInstance.value.close()
  console.error(error)
}

const handleSubmit = () => {
  ElMessageBox.confirm("仅可上传一次，一旦确认不可再次上传，不可超时上传，请确认无勿再上传！", "上传确认", {
    confirmButtonText: "确认上传并填报",
    cancelButtonText: "再检查一下",
    type: "warning"
  })
    .then(() => {
      confirmUploadApi().then((res: any) => {
        if (res.code === 200) {
          ElMessage.success("提交成功")
          setTimeout(() => {
            router.push({ path: "/dashboard" })
          }, 2000)
        } else {
          ElMessage.error(res.message)
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消提交"
      })
    })
}

const handleExportWord = async () => {
  const downloadLoadingInstance = ElLoading.service({
    text: "正在下载文件，请稍候",
    lock: true,
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    const response: any = await getFileApi({ path: addTask.value.attachmentPath })
    saveAs(response, `填报要求说明书.doc`)
    downloadLoadingInstance.close()
    ElMessage.success("文件下载完成")
  } catch (error) {
    console.error("导出Word文件出错", error)
    ElMessage.error("下载文件出现错误！")
    downloadLoadingInstance.close()
  }
}

function getFillingStatusLabel(taskStatus: any) {
  const statusMap: { [key: string]: string } = {
    1: "未填报",
    2: "已填报",
    3: "待重新填报"
  }

  return statusMap[taskStatus as number] || "未知状态"
}

const reverseFormatDateTime = (timeString: string) => {
  if (!timeString) {
    return
  }
  const regex = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})$/
  const match = timeString.match(regex)

  if (!match) {
    return timeString
  }

  const datePart = match[1]
  const timePart = match[2]

  return `${datePart} ${timePart}`
}

onMounted(async () => {
  isLoaded.value = false
  await getRegistrationStatueApi().then((res: any) => {
    registerStatue.value = res.data
  })
  await getAddTaskApi().then((res: any) => {
    if (res.code === 200) {
      addTask.value = res.data
    }
  })
  isLoaded.value = true
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
            {{ getFillingStatusLabel(registerStatue?.fillingStatus) || "状态未知" }}
          </div>
        </div>
        <div class="font-800 text-6">上传填报</div>
        <img src="../../../assets//user/add.gif" alt="GIF 图片" class="w-100" />
        <div
          class="color-black mb-4 underline @hover:cursor-pointer color-blue @hover:color-#1D5D9B"
          @click="handleExportWord"
        >
          请点击此处下载上传填报要求说明书
        </div>
        <div class="text-slate-500">开始时间：{{ reverseFormatDateTime(addTask?.startTime) || "暂无数据" }}</div>
        <div class="my-1 text-slate-500">截至时间：{{ reverseFormatDateTime(addTask?.endTime) || "暂无数据" }}</div>
      </div>
      <div
        class="h-full w-60vw flex justify-center flex-col items-center rounded-4 mx-8"
        style="box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff"
      >
        <div class="flex items-center justify-center flex-col">
          <el-upload
            class="avatar-uploader"
            :show-file-list="true"
            :limit="1"
            :action="uploadUrl"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :on-error="handleError"
            :headers="{ token: token }"
          >
            <div v-if="registerStatue?.hasAttachment" class="flex items-center justify-center flex-col pt-2">
              <Uploaded />
              <span class="font-800 my-4">已保存</span>
            </div>
            <div v-else class="flex items-center justify-center flex-col pt-2">
              <Upload />
              <span class="font-800 my-4">待上传</span>
            </div>
          </el-upload>
          <div class="mt-2">上传附件压缩包</div>
          <div class="text-2 mt-2 mb-1">（压缩包以“学校+专业+姓名”命名，大</div>
          <div class="text-2">小不可超过30MB，支持zip、rar格式）</div>
          <el-button type="primary" @click="handleSubmit" class="mt-4">确认上传并填报</el-button>
        </div>
      </div>
      <!-- <el-dialog v-model="dialogVisible" title="上传填报" draggable width="40%" center>
        <div class="flex items-center justify-center flex-col">
          <el-upload
            class="avatar-uploader"
            :show-file-list="true"
            :limit="1"
            :action="uploadUrl"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :on-error="handleError"
            :headers="{ token: token }"
          >
            <el-icon v-if="!registerStatue?.hasAttachment" class="text-40!"><upload-filled /></el-icon>
            <el-icon v-if="registerStatue?.hasAttachment" class="text-40!"><Check /></el-icon>
            <div class="mt-4">上传附件压缩包</div>
            <div class="text-2">（压缩包以“学校+专业+姓名”命名，大</div>
            <div class="text-2">小不可超过30MB，支持zip、rar格式）</div>
          </el-upload>
        </div>
        <template #footer>
          <el-button @click="dialogVisible = false" class="mr-16">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认提交</el-button>
        </template>
      </el-dialog> -->
    </div>
  </div>
</template>

<style scoped>
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 0.5rem;
}
</style>
