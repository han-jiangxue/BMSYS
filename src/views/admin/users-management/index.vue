<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from "vue"
import { type FormInstance, ElMessage, ElPopconfirm, ElDescriptionsItem, ElDescriptions, ElLoading } from "element-plus"
import {
  getAddInfoApi,
  reviewAPI,
  deleteApi,
  searchApi,
  getDetailApi,
  getExcelFileApi,
  getZipFileApi
} from "@/api/admin/users-management"
import { usePagination } from "@/hooks/usePagination"
import { Download } from "@element-plus/icons-vue"
import { saveAs } from "file-saver"

/* 管理员账号 */

// TODU：类型提升
const isSearch = ref<boolean>(false)
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const tableData = ref<any>([])
const searchFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)
const searchData = reactive({
  idCardNumber: "",
  realName: "",
  halfYear: ""
})
const currentDetail = ref()

const getTableData = () => {
  if (isSearch.value) {
    return
  }
  loading.value = true
  getAddInfoApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize
  })
    .then((res: any) => {
      paginationData.total = res.data.totalCount
      tableData.value = res.data.pageData
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const getTableSearchData = () => {
  if (!isSearch.value) {
    return
  }
  loading.value = true
  searchApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    ...searchData
  })
    .then((res: any) => {
      paginationData.total = res.data.totalCount
      tableData.value = res.data.pageData
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

function getFillingStatusLabel(taskStatus: any) {
  const statusMap: { [key: string]: string } = {
    1: "未填报",
    2: "已填报",
    3: "待重新填报"
  }

  return statusMap[taskStatus as number] || "未知状态"
}

function getReviewStatusLabel(taskStatus: any) {
  const statusMap: { [key: string]: string } = {
    1: "未审核",
    2: "未通过",
    3: "通过",
    4: "已退回",
    5: ""
  }

  return statusMap[taskStatus as number] || "未知状态"
}

function getExamStatusStatusLabel(taskStatus: any) {
  const statusMap: { [key: string]: string } = {
    1: "未确认",
    2: "已确认",
    3: "取消",
    4: ""
  }

  return statusMap[taskStatus as number] || "未知状态"
}

function getPoliticalOutlookStatusLabel(taskStatus: any) {
  const statusMap: { [key: string]: string } = {
    1: "中共党员",
    2: "中共预备党员",
    3: "共青团员",
    4: "共青团员"
  }

  return statusMap[taskStatus as number] || "未知状态"
}

function getMaritalStatusLabel(taskStatus: any) {
  const statusMap: { [key: string]: string } = {
    1: "已婚",
    2: "未婚",
    3: "离异",
    4: "丧偶"
  }

  return statusMap[taskStatus as number] || "未知状态"
}

const handelReview = (idCardNumber: number, reviewStatus: number) => {
  const params = { idCardNumber, reviewStatus }
  reviewAPI([params]).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success(res.message)
    }
  })
  getTableData()
  getTableSearchData()
}

const getDetail = async (row: any) => {
  await getDetailApi(row.idCardNumber).then((res: any) => {
    currentDetail.value = { ...res.data, ...row }
  })
  dialogVisible.value = true
}

const resetSearch = () => {
  isSearch.value = false
  searchFormRef.value?.resetFields()
  const defaultSearchData = {
    idCardNumber: "",
    realName: "",
    halfYear: ""
  }
  Object.assign(searchData, defaultSearchData)
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

async function handleDelete(id: number) {
  await deleteApi([id])
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success("删除成功")
        getTableData()
      } else {
        ElMessage.error(res.message)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleSearch = async () => {
  isSearch.value = true
  await getTableSearchData()
}

const handleExportWord = async () => {
  const downloadLoadingInstance = ElLoading.service({
    text: "正在下载文件，请稍候",
    lock: true,
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    const response: any = await getExcelFileApi()
    // console.log(response.headers["content-disposition"], "hh")

    saveAs(response, `汇总表.xlsx`)
    downloadLoadingInstance.close()
    ElMessage.success("文件下载完成")
  } catch (error) {
    console.error("导出Excel文件出错", error)
    ElMessage.error("下载文件出现错误！")
    downloadLoadingInstance.close()
  }
}

const handleExportZip = async (data: any) => {
  const downloadLoadingInstance = ElLoading.service({
    text: "正在下载文件，请稍候",
    lock: true,
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    const response: any = await getZipFileApi({ id: data.idCardNumber })
    saveAs(response, `${data.realName}.zip`)
    downloadLoadingInstance.close()
    ElMessage.success("压缩包下载完成")
  } catch (error) {
    console.error("导出文件出错", error)
    ElMessage.error("下载压缩包出现错误！")
    downloadLoadingInstance.close()
  }
}

/** 监听分页参数的变化 */
watch(
  [() => paginationData.currentPage, () => paginationData.pageSize],
  () => {
    getTableData()
    getTableSearchData()
  },
  {
    immediate: true
  }
)

onMounted(async () => {
  // const res = await getAddInfoApi({
  //   currentPage: 1,
  //   size: 10
  // })
  // console.log(res)
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="realName" label="姓名">
          <el-input v-model="searchData.realName" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item prop="idCardNumber" label="身份证号">
          <el-input v-model="searchData.idCardNumber" placeholder="请输入身份证号" clearable />
        </el-form-item>
        <el-form-item label="年份">
          <el-select v-model="searchData.halfYear" placeholder="请选择年份" clearable>
            <el-option label="上半年" :value="1" />
            <el-option label="下半年" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Download" @click="handleExportWord">导出Excel表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="index" width="50" align="center" />
          <el-table-column prop="idCardNumber" label="身份证号" width="150px" align="center" />
          <el-table-column prop="realName" label="姓名" align="center" />
          <el-table-column prop="fillingDate" label="报名日期" align="center" />
          <el-table-column prop="fillingStatus" label="填报状态" align="center">
            <template #default="scope">
              {{ getFillingStatusLabel(scope.row.fillingStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="reviewStatus" label="审核状态" align="center">
            <template #default="scope">
              {{ getReviewStatusLabel(scope.row.reviewStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="examStatus" label="考试状态" align="center">
            <template #default="scope">
              {{ getExamStatusStatusLabel(scope.row.examStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="cancelReason" label="原因" align="center" />
          <el-table-column fixed="right" label="审核" width="200" align="center">
            <template #default="scope">
              <el-popconfirm
                title="确认通过吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handelReview(scope.row.idCardNumber, 3)"
              >
                <template #reference>
                  <el-button type="primary" text bg size="small">通过</el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm
                title="确认不通过吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handelReview(scope.row.idCardNumber, 2)"
              >
                <template #reference>
                  <el-button type="primary" text bg size="small">不通过</el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm
                title="确认退回吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handelReview(scope.row.idCardNumber, 4)"
              >
                <template #reference>
                  <el-button type="danger" text bg size="small">退回</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="getDetail(scope.row)">详情</el-button>
              <el-button type="primary" text bg size="small" @click="handleExportZip(scope.row)">下载</el-button>
              <el-popconfirm
                title="确认删除该任务吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row.idCardNumber)"
              >
                <template #reference>
                  <el-button type="danger" text bg size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 详情 -->
    <el-dialog v-model="dialogVisible" @close="dialogVisible = false" draggable width="80%">
      <el-descriptions border :column="2" title="详情">
        <el-descriptions-item min-width="60px" label="姓名">{{ currentDetail.realName }}</el-descriptions-item>
        <el-descriptions-item min-width="60px" label="性别">{{
          currentDetail.gender === 1 ? "男" : "女"
        }}</el-descriptions-item>
        <el-descriptions-item label="名族">{{ currentDetail.nation }}</el-descriptions-item>
        <el-descriptions-item label="籍贯">{{ currentDetail.position }}</el-descriptions-item>
        <el-descriptions-item label="政治面貌">{{
          getPoliticalOutlookStatusLabel(currentDetail.politicalOutlook)
        }}</el-descriptions-item>
        <el-descriptions-item label="入党时间">{{ currentDetail.partyJoiningTime }}</el-descriptions-item>
        <el-descriptions-item label="出生年月">{{ currentDetail.birthday }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentDetail.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ currentDetail.idCardNumber }}</el-descriptions-item>
        <el-descriptions-item label="报名日期">{{ currentDetail.fillingDate }}</el-descriptions-item>
        <el-descriptions-item label="填报状态">{{
          getFillingStatusLabel(currentDetail.fillingStatus)
        }}</el-descriptions-item>
        <el-descriptions-item label="考试状态">{{
          getExamStatusStatusLabel(currentDetail.examStatus)
        }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">{{
          getReviewStatusLabel(currentDetail.reviewStatus)
        }}</el-descriptions-item>
        <el-descriptions-item label="原因">{{ currentDetail.cancelReason }}</el-descriptions-item>
        <el-descriptions-item label="婚姻状况">{{
          getMaritalStatusLabel(currentDetail.maritalStatus)
        }}</el-descriptions-item>
        <el-descriptions-item label="英语水平">{{ currentDetail.englishProficiency }}</el-descriptions-item>
        <el-descriptions-item label="英语成绩">{{ currentDetail.englishScore }}</el-descriptions-item>
        <el-descriptions-item label="家庭所在地">{{ currentDetail.homeLocation }}</el-descriptions-item>
        <el-descriptions-item label="现所在地">{{ currentDetail.currentLocation }}</el-descriptions-item>
        <el-descriptions-item label="就读学校及专业">{{ currentDetail.educationBackground }}</el-descriptions-item>
        <el-descriptions-item label="本科就读学校">{{ currentDetail.undergraduateUniversity }}</el-descriptions-item>
        <el-descriptions-item label="本科就读专业">{{ currentDetail.undergraduateMajor }}</el-descriptions-item>
        <el-descriptions-item label="硕士就读学校">{{ currentDetail.masterUniversity }}</el-descriptions-item>
        <el-descriptions-item label="硕士就读专业">{{ currentDetail.masterMajor }}</el-descriptions-item>
        <el-descriptions-item label="博士就读学校">{{ currentDetail.phdUniversity }}</el-descriptions-item>
        <el-descriptions-item label="博士就读专业">{{ currentDetail.phdMajor }}</el-descriptions-item>
        <el-descriptions-item label="参加公务员或选调生报名考试及拟录取情况">{{
          currentDetail.civilServiceExam
        }}</el-descriptions-item>
        <el-descriptions-item label="个人经历">{{ currentDetail.personalExperience }}</el-descriptions-item>
        <el-descriptions-item label="担任学生干部或从事学生教育管理工作经历">{{
          currentDetail.studentLeadershipExperience
        }}</el-descriptions-item>
        <el-descriptions-item label="学习期间所获荣誉称号情况">{{ currentDetail.academicHonors }}</el-descriptions-item>
        <el-descriptions-item label="何时何地何原因受过何种处分">{{
          currentDetail.disciplinaryRecord
        }}</el-descriptions-item>
        <el-descriptions-item label="其他支撑材料">{{ currentDetail.otherSupportingDocuments }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
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
</style>
