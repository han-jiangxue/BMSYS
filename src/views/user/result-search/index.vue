<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { getRegistrationStatueApi } from "@/api/user/add-info"
import { getScoreApi, getExamTaskApi } from "@/api/user/result-search"
import { useUserStore } from "@/store/modules/user"
import Result from "@/assets/user/result.svg?component"
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

const userName = ref()
const resultInfo = ref()
const registerStatue = ref<registerStatueType>()

const handelSearch = async () => {
  getExamTaskApi().then((res: any) => {
    if (res.code === 200) {
      getScoreApi({ taskId: res.data.examTaskId }).then((res: any) => {
        if (res.code === 200) {
          resultInfo.value = res.data
        }
      })
    } else {
      ElMessage.warning(res.message)
    }
  })
}

onMounted(async () => {
  await getRegistrationStatueApi().then((res: any) => {
    registerStatue.value = res.data
  })
  if (registerStatue.value?.reviewStatus !== 3) {
    ElMessage.warning("填报审核通过后方可进入")
    setTimeout(() => {
      router.push({ path: "/dashboard" })
    }, 2000)
  }
  userName.value = useUserStore().username
  handelSearch()
})
</script>

<template>
  <div class="app-container">
    <div class="h-80vh flex justify-between items-center">
      <div
        class="h-full flex justify-center flex-col items-center rounded-8 relative overflow-hidden"
        style="box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff"
      >
        <div class="font-800 text-6">结果查询</div>
        <img src="../../../assets//user/search.gif" alt="GIF 图片" class="w-100" />
      </div>
      <div
        class="h-full w-60vw flex justify-center flex-col items-center rounded-4 mx-8"
        style="box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff"
      >
        <Result />
        <div class="flex justify-center my-4 items-center font-800">
          <div class="mx-10 mt-10">姓名：{{ userName }}</div>
          <div class="mx-10 mt-10">成绩：{{ resultInfo || "暂无数据" }}</div>
        </div>
        <el-button type="primary" @click="handelSearch">一键查询</el-button>
      </div>
    </div>
  </div>
</template>
