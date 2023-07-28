<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from "vue"
import { type FormInstance, ElMessage, ElPopconfirm, ElLoading } from "element-plus"
import { Download } from "@element-plus/icons-vue"
import {
  getScoreAPI,
  importScoreAPI,
  getExamTaskAPI,
  deleteScoreAPI,
  addScoreAPI,
  editScoreAPI,
  deleteScoreListAPI
} from "@/api/admin/score-management"
import { usePagination } from "@/hooks/usePagination"
// import { formatDateTime } from "@/utils"

// TODU: 新增
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const tableData = ref<any>([])
const searchFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)
const currentUpdateId = ref<undefined | number>(undefined)
const examTaskId = ref()
const searchData = reactive({
  isMatch: "",
  name: ""
})
const formData = reactive({
  idCardNumber: "",
  realName: "",
  fillingTaskId: "",
  score: "",
  achievementId: ""
})
const formRef = ref<FormInstance | null>(null)
const deleteArray = ref([])

const getTableData = () => {
  loading.value = true
  getScoreAPI({
    taskId: `${examTaskId.value}`,
    current: paginationData.currentPage,
    size: paginationData.pageSize,
    ...searchData
  })
    .then((res: any) => {
      paginationData.total = res.data.total

      tableData.value = res.data.records
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const resetForm = () => {
  currentUpdateId.value = undefined
  formData.idCardNumber = ""
  formData.realName = ""
  formData.score = ""
}

const handleSelect = (data: any) => {
  deleteArray.value = data.map((item: any) => item.achievementId)
}

const handleUpdate = (row: any) => {
  currentUpdateId.value = row.achievementId
  formData.idCardNumber = row.idCardNumber
  formData.achievementId = row.achievementId
  formData.realName = row.realName
  formData.score = row.score
  dialogVisible.value = true
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  searchData.name = ""
  searchData.isMatch = ""
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

function getStatusLabel(taskStatus: any) {
  const statusMap: { [key: number]: string } = {
    "0": "不匹配",
    "1": "匹配"
  }

  return statusMap[taskStatus as number] || "未知状态"
}

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // formData.createDate = formatDateTime(formData.createDate, "YYYY-MM-DD HH:mm:ss")
      // formData.modifyDate = formatDateTime(formData.createDate, "YYYY-MM-DD HH:mm:ss")
      if (currentUpdateId.value === undefined) {
        addScoreAPI(formData).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        editScoreAPI(formData).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          getTableData()
        })
      }
    } else {
      return false
    }
  })
}

const handleDelete = (id: any) => {
  deleteScoreAPI({ id }).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("删除成功")
      getTableData()
    } else {
      ElMessage.warning(res.message)
    }
  })
}

const handleDeleteScoreLists = async () => {
  if (deleteArray.value.length === 0) {
    ElMessage.warning("请选择后再删除")
    return
  }
  await deleteScoreListAPI([...deleteArray.value]).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("删除成功")
      getTableData()
    }
  })
}

const handleUpload = async (res: any) => {
  const uploadLoadingInstance = ElLoading.service({
    text: "正在导入文件，请稍候",
    lock: true,
    background: "rgba(0, 0, 0, 0.7)"
  })
  const formData = new FormData()
  formData.append("file", res.file)
  formData.append("taskId", `${examTaskId.value}`)
  await importScoreAPI(formData)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.message)
        uploadLoadingInstance.close()
        getTableData()
      } else {
        ElMessage.warning(res.message)
        uploadLoadingInstance.close()
      }
    })
    .catch((err: any) => {
      console.error(err)
      uploadLoadingInstance.close()
    })
}

onMounted(() => {
  getExamTaskAPI().then((res: any) => {
    examTaskId.value = res.data.examTaskId
    formData.fillingTaskId = res.data.examTaskId
    getTableData()
  })
})

/** 监听分页参数的变化 */
watch(
  [() => paginationData.currentPage, () => paginationData.pageSize],
  () => {
    getTableData()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="searchData.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <!-- <el-form-item label="年份">
          <el-select v-model="searchData.year" placeholder="请选择年份" clearable>
            <el-option label="2023" :value="2023" />
            <el-option label="2022" :value="2022" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否匹配">
          <el-select v-model="searchData.isMatch" placeholder="请选择" clearable>
            <el-option label="匹配" :value="1" />
            <el-option label="不匹配" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload :show-file-list="false" :http-request="handleUpload">
            <el-button type="primary" :icon="Download">导入Excel表</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = true">新增</el-button>
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-popconfirm
            title="确认删除该记录吗？"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDeleteScoreLists"
          >
            <template #reference>
              <el-button type="danger">批量删除</el-button>
            </template>
          </el-popconfirm>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading">
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelect">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="idCardNumber" label="身份证号" align="center" />
          <el-table-column prop="realName" label="姓名" align="center" />
          <el-table-column prop="score" label="成绩" align="center" />
          <el-table-column prop="importDate" label="导入日期" align="center" />
          <el-table-column prop="isMatch" label="是否匹配" align="center">
            <template #default="scope">
              {{ getStatusLabel(scope.row.isMatch) }}
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-popconfirm
                title="确认删除该记录吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row.achievementId)"
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
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增成绩' : '修改成绩'"
      @close="resetForm"
      draggable
      width="30%"
    >
      <el-form ref="formRef" :model="formData" label-width="100px" label-position="left">
        <el-form-item prop="realName" label="姓名">
          <el-input v-model="formData.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="idCardNumber" label="身份证号">
          <el-input v-model="formData.idCardNumber" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item prop="score" label="成绩">
          <el-input v-model="formData.score" placeholder="请输入成绩" />
        </el-form-item>
        <!-- <el-form-item label="是否可见">
          <el-radio-group v-model="formData.visible">
            <el-radio label="0">可见</el-radio>
            <el-radio label="1">不可见</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
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
