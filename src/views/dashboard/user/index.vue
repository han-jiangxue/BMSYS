<script lang="ts" setup>
// import { ElDescriptions, ElDescriptionsItem } from "element-plus"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { getAllNoticeAPI } from "@/api/user/notice-info"
import { getRegistrationStatueApi } from "@/api/user/add-info"
import { useUserStore } from "@/store/modules/user"

interface NoticeListType {
  announcementId: number
  link: string
  modifyDate: string
  title: string
}

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

const router = useRouter()
const userStore = useUserStore()

const NoticeList = ref<NoticeListType[]>()

const handleSkip = (url: string) => {
  if (!userStore.roles.includes("user")) {
    return
  }
  router.push({ path: `/${url}` })
}

const handleRedirect = (externalURL: string) => {
  window.location.href = externalURL
}

const registerStatue = ref<registerStatueType>()

onMounted(async () => {
  const res: any = await getAllNoticeAPI()
  NoticeList.value = res.data
  await getRegistrationStatueApi().then((res: any) => {
    registerStatue.value = res.data
  })
})
</script>

<template>
  <div class="app-container h-full">
    <el-card class="search-wrapper bg-#E0F0EF! h-full">
      <div class="flex h-100 items-center justify-between">
        <div class="w-50% h-full flex flex-col items-center justify-center">
          <div class="flex justify-start items-center">
            <div class="flex justify-start items-center mb-18">
              <div
                class="rounded-8 p-6 justify-center w-30 h-30 m-4 bg-#4076B1 font-800"
                @click="handleSkip('add-info')"
              >
                信息填写
              </div>
              <div class="w-8 h-8 bg-#FFF" />
              <div class="triangle-right" />
            </div>
            <div class="flex-col items-center justify-center flex">
              <div
                class="rounded-8 p-6 justify-center w-30 h-30 m-4 font-800"
                :class="{
                  'bg-#4076B1': registerStatue?.fillingStatus === 2,
                  'bg-white': registerStatue?.fillingStatus !== 2
                }"
                @click="handleSkip('submit-info')"
              >
                上传填报
              </div>
              <div class="w-8 h-8 bg-#FFF" />
              <div class="triangle-down" />
            </div>
          </div>
          <div class="flex justify-start items-center">
            <div
              class="rounded-8 p-6 justify-center w-30 h-30 m-4 bg-#FFF font-800"
              @click="handleSkip('result-search')"
            >
              结果查询
            </div>
            <div class="triangle-left" />
            <div class="w-8 h-8 bg-#FFF" />
            <div
              class="rounded-8 p-6 justify-center w-30 h-30 m-4 font-800"
              :class="{
                'bg-#4076B1': registerStatue?.examStatus === 2,
                'bg-white': registerStatue?.examStatus !== 2
              }"
              @click="handleSkip('exam-confirm')"
            >
              考试确认
            </div>
          </div>
        </div>
        <div class="w-50% h-80% bg-#E8C664 rounded-4">
          <div class="w-full h-10% flex items-center justify-center"><div class="font-600 color-#FFF">公告栏</div></div>
          <div v-if="NoticeList" class="overflow-y-auto h-90%">
            <div v-for="(item, index) in NoticeList" :key="index" class="flex justify-center">
              <div
                class="border border-#fff border-dashed w-60% @hover:cursor-pointer h-6 color-#212529 font-600 items-center flex justify-center"
                @click="handleRedirect(item.link)"
              >
                {{ item?.title }}
              </div>
              <div
                class="border border-#fff border-dashed w-25% h-6 color-#212529 text-3 items-center flex justify-center"
              >
                {{ item?.modifyDate }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-80 bg-#4076B1 px-4 py-12">
        <div class="color-#FFF mb-4">意见反馈邮箱：fdycumt@163.com</div>
        <div class="color-#FFF">工作单位：中国矿业大学党委学生工作部</div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
.triangle-right {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-left: 40px solid #fff;
}
.triangle-left {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-right: 40px solid #fff;
}
.triangle-down {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-top: 40px solid #fff;
}
</style>
