<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { ElNotification } from "element-plus"
import { useUserStore } from "@/store/modules/user"
import { getGetAllNoticeAPI } from "@/api/admin/notice-management"
import { getAddTaskStatueAPI } from "@/api/admin/add-management"

interface NoticeListType {
  announcementId: number
  link: string
  modifyDate: string
  title: string
}

const router = useRouter()
const userStore = useUserStore()

const NoticeList = ref<NoticeListType[]>()

const settingStatue = ref({
  addTaskSetting: undefined,
  examTaskSetting: undefined
})

const handleSkip = (url: string) => {
  if (!userStore.roles.includes("user")) {
    return
  }
  router.push({ path: `/${url}` })
}

const handleRedirect = (externalURL: string) => {
  window.location.href = externalURL
}

onMounted(async () => {
  const res: any = await getGetAllNoticeAPI({
    current: 1,
    size: 100
  })
  NoticeList.value = res.data.data.records
  await getAddTaskStatueAPI().then((res: any) => {
    settingStatue.value.addTaskSetting = res.data
  })
  ElNotification({
    title: "设置状态",
    dangerouslyUseHTMLString: true,
    message: `<strong>填报管: <i>${
      settingStatue.value?.addTaskSetting ? "已设置" : "未设置"
    }</i></strong><br><strong>考试管理: <i>暂无数据</i></strong>`
  })
})
</script>

<template>
  <div class="app-container h-full">
    <el-card class="search-wrapper bg-#E0F0EF! h-full">
      <div class="flex h-65vh items-center justify-between">
        <div class="w-50% h-full flex flex-col items-center justify-center text-5">
          <div class="flex justify-start items-center">
            <div class="flex justify-start items-center mb-18">
              <div
                class="rounded-8 p-6 flex justify-center items-center w-40 h-40 m-4 bg-#4076B1 font-800"
                @click="handleSkip('add-info')"
              >
                信息填写
              </div>
              <div class="w-8 h-8 bg-#FFF" />
              <div class="triangle-right" />
            </div>
            <div class="flex-col items-center justify-center flex">
              <div
                class="rounded-8 p-6 flex justify-center items-center w-40 h-40 m-4 bg-#4076B1 font-800"
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
              class="rounded-8 p-6 flex justify-center items-center w-40 h-40 m-4 bg-#4076B1 font-800"
              @click="handleSkip('exam-confirm')"
            >
              考试确认
            </div>
            <div class="triangle-left" />
            <div class="w-8 h-8 bg-#FFF" />
            <div
              class="rounded-8 p-6 flex justify-center items-center w-40 h-40 m-4 bg-#4076B1 font-800"
              @click="handleSkip('result-search')"
            >
              结果查询
            </div>
          </div>
        </div>
        <div class="w-50% h-80% bg-#E8C664 rounded-4">
          <div class="w-full h-10% flex items-center justify-center"><div class="font-600 color-#FFF">公告栏</div></div>
          <div v-if="NoticeList" class="overflow-y-auto h-90%">
            <div v-for="(item, index) in NoticeList" :key="index" class="flex justify-center">
              <div
                class="border border-#fff border-dashed w-60% h-6 @hover:cursor-pointer color-#212529 font-600 items-center flex justify-center"
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
            <!-- <el-descriptions border :column="1" v-if="NoticeList" class="overflow-y-auto">
              <div v-for="(item, index) in NoticeList" :key="index">
                <el-descriptions-item :label="item?.title">{{ item?.modifyDate }}</el-descriptions-item>
              </div>
            </el-descriptions> -->
          </div>
        </div>
      </div>
      <div class="w-full h-80vh bg-#4682A9 px-4 py-6">
        <div class="color-#FFF mb">意见反馈邮箱：fdycumt@163.com</div>
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
