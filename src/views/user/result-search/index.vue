<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { getScoreApi, getExamTaskApi } from "@/api/user/result-search"

const dialogVisible = ref(true)
const resultInfo = ref()

onMounted(() => {
  getExamTaskApi().then((res: any) => {
    if (res.code === 200) {
      getScoreApi({ taskId: res.data.examTaskId }).then((res: any) => {
        resultInfo.value = res.data
      })
    } else {
      ElMessage.warning(res.message)
    }
  })
})
</script>

<template>
  <div class="h-full flex justify-center items-center">
    <el-dialog v-model="dialogVisible" title="成绩查询" draggable width="40%" center>
      <div class="flex items-center justify-center">{{ resultInfo }}</div>
      <template #footer>
        <el-button @click="dialogVisible = false" type="primary" class="mr-16">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
