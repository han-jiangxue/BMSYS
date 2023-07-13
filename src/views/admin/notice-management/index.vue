<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from "vue"
import { type FormInstance, ElMessage, ElPopconfirm } from "element-plus"
import {
  getNoticeBasedYearAPI,
  addNoticeAPI,
  editNoticeAPI,
  getNoticeBasedTitleAPI,
  getGetAllNoticeAPI,
  deleteNoticeAPI
} from "@/api/admin/notice-management"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils"

// TODU: 删除
const loading = ref<boolean>(false)
const isSearch = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const tableData = ref<any>([])
const searchFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)
const currentUpdateId = ref<undefined | number>(undefined)
const searchData = reactive({
  year: new Date().getFullYear(),
  title: ""
})
const formData = reactive({
  title: "",
  createDate: "",
  link: "",
  issued: "",
  visible: "1",
  announcementId: ""
})
const formRef = ref<FormInstance | null>(null)

const getTableData = () => {
  if (isSearch.value) {
    return
  }
  loading.value = true
  getGetAllNoticeAPI({
    current: paginationData.currentPage,
    size: paginationData.pageSize
  })
    .then((res: any) => {
      paginationData.total = res.data.data.total
      tableData.value = res.data.data.records
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
  if (!searchData.title) {
    getNoticeBasedYearAPI({
      current: paginationData.currentPage,
      size: paginationData.pageSize,
      year: searchData.year
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
  } else {
    getNoticeBasedTitleAPI({
      current: paginationData.currentPage,
      size: paginationData.pageSize,
      title: searchData.title
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
}

const resetForm = () => {
  currentUpdateId.value = undefined
  formData.title = ""
  formData.issued = ""
  formData.createDate = ""
  formData.link = ""
  formData.visible = "1"
  formData.announcementId = ""
}

const handleUpdate = (row: any) => {
  currentUpdateId.value = row.announcementId
  formData.announcementId = row.announcementId
  formData.title = row.title
  formData.issued = row.issued
  formData.createDate = row.createDate
  formData.link = row.link
  formData.visible = row.visible
  dialogVisible.value = true
}

const resetSearch = () => {
  isSearch.value = false
  searchFormRef.value?.resetFields()
  searchData.title = ""
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

function getStatusLabel(taskStatus: any) {
  const statusMap: { [key: number]: string } = {
    "1": "可见",
    "0": "不可见"
  }

  return statusMap[taskStatus as number] || "未知状态"
}

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      formData.createDate = formatDateTime(formData.createDate, "YYYY-MM-DD HH:mm:ss")
      if (currentUpdateId.value === undefined) {
        addNoticeAPI(formData).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        editNoticeAPI(formData).then(() => {
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

const handleSearch = async () => {
  isSearch.value = true
  await getTableSearchData()
}

const handleDelete = (id: any) => {
  deleteNoticeAPI({
    id
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

onMounted(() => {
  // const res = getNoticeBasedYearAPI({
  //   year: 2023,
  //   page: 10
  // })
  // console.log(res)
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="taskName" label="公告标题">
          <el-input v-model="searchData.title" placeholder="请输入公告标题" clearable />
        </el-form-item>
        <el-form-item label="时间">
          <el-select v-model="searchData.year" placeholder="请选择时间" clearable>
            <el-option label="2023" :value="2023" />
            <el-option label="2022" :value="2022" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button @click="dialogVisible = true">新增公告</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="index" width="50" align="center" />
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column prop="createDate" label="创建时间" align="center" />
          <el-table-column prop="modifyDate" label="更新时间" align="center" />
          <el-table-column prop="issued" label="发布单位" align="center" />
          <el-table-column prop="visible" label="是否可见" align="center">
            <template #default="scope">
              {{ getStatusLabel(scope.row.visible) }}
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-popconfirm
                title="确认删除该公告吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row.announcementId)"
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
      :title="currentUpdateId === undefined ? '新增公告' : '修改公告'"
      @close="resetForm"
      draggable
      width="30%"
    >
      <el-form ref="formRef" :model="formData" label-width="100px" label-position="left">
        <el-form-item prop="task" label="公告标题">
          <el-input type="textarea" v-model="formData.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="formData.createDate" type="datetime" placeholder="请选择时间" />
        </el-form-item>
        <el-form-item prop="link" label="超链接">
          <el-input v-model="formData.link" placeholder="请输入超链接" />
        </el-form-item>
        <el-form-item prop="issued" label="发布单位">
          <el-input v-model="formData.issued" placeholder="请输入发布单位" />
        </el-form-item>
        <el-form-item label="是否可见">
          <el-radio-group v-model="formData.visible">
            <el-radio label="1">可见</el-radio>
            <el-radio label="0">不可见</el-radio>
          </el-radio-group>
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
