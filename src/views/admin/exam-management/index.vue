<script lang="ts" setup>
import { ref, watch, reactive } from "vue"
import {
  getExamAPI,
  getExamSearchAPI,
  openExamAPI,
  delExamAPI,
  AddExamApi,
  EditExamApi
} from "@/api/admin/exam-management"
import { type FormInstance, type FormRules, ElMessage, ElPopconfirm } from "element-plus"
import { formatDateTime } from "@/utils"
import { usePagination } from "@/hooks/usePagination"

const loading = ref<boolean>(false)
const isSearch = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const tableData = ref<any>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  taskName: ""
})
const dialogVisible = ref<boolean>(false)
const currentUpdateId = ref<undefined | number>(undefined)
const formData = reactive({
  task: "",
  startTime: "",
  endTime: "",
  remark: ""
})
const formRules: FormRules = reactive({
  task: [{ required: true, trigger: "blur", message: "请输入任务名称" }],
  startTime: [{ required: true, trigger: "blur", message: "请选择开始时间" }],
  endTime: [{ required: true, trigger: "blur", message: "请选择结束时间" }]
})
const formRef = ref<FormInstance | null>(null)

const getTableData = () => {
  if (isSearch.value) {
    return
  }
  loading.value = true
  getExamAPI({
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
  getExamSearchAPI({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    taskName: searchData.taskName
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

const handleSearch = async () => {
  if (!searchData.taskName) {
    ElMessage.warning("请输入任务名称")
    return
  }
  isSearch.value = true
  await getTableSearchData()
}

const resetSearch = () => {
  isSearch.value = false
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

function getStatusLabel(taskStatus: any) {
  const statusMap: { [key: number]: string } = {
    1: "启动",
    2: "已结束",
    3: "实施中",
    4: "草稿"
  }

  return statusMap[taskStatus as number] || "未知状态"
}

async function open(id: number) {
  await openExamAPI(id)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success("启动成功")
        getTableData()
      } else {
        ElMessage.error(res.message)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function handleDelete(id: number) {
  await delExamAPI(id)
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

const resetForm = () => {
  currentUpdateId.value = undefined
  formData.task = ""
  formData.remark = ""
  formData.startTime = ""
  formData.endTime = ""
}

const handleUpdate = (row: any) => {
  currentUpdateId.value = row.examTaskId
  formData.endTime = row.endTime
  formData.startTime = row.startTime
  formData.remark = row.remark
  formData.task = row.task
  dialogVisible.value = true
}

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      formData.startTime = formatDateTime(formData.startTime)
      formData.endTime = formatDateTime(formData.endTime)
      if (currentUpdateId.value === undefined) {
        AddExamApi(formData).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        EditExamApi(formData, currentUpdateId.value as unknown as number).then(() => {
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
// onMounted(async () => {
//   const res = await getTableSearchData()
//   console.log(res)
// })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="taskName" label="任务名称">
          <el-input v-model="searchData.taskName" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button @click="dialogVisible = true">新增考试任务</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="task" label="任务名称" align="center" />
          <el-table-column prop="startTime" label="开始时间" align="center" />
          <el-table-column prop="endTime" label="截至时间" align="center" />
          <el-table-column prop="taskStatus" label="状态" align="center">
            <template #default="scope">
              {{ getStatusLabel(scope.row.taskStatus) }}
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-popconfirm
                title="确认开启该任务吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="open(scope.row.examTaskId)"
              >
                <template #reference>
                  <el-button type="primary" text bg size="small">启动</el-button>
                </template>
              </el-popconfirm>
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-popconfirm
                title="确认删除该任务吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row.examTaskId)"
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
      :title="currentUpdateId === undefined ? '新增考试任务' : '修改考试任务'"
      @close="resetForm"
      draggable
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="task" label="任务名称">
          <el-input v-model="formData.task" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="formData.startTime"
            :rules="formRules.startTime"
            type="datetime"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="formData.endTime"
            :rules="formRules.endTime"
            type="datetime"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="formData.remark" placeholder="请输入备注" />
        </el-form-item>
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
