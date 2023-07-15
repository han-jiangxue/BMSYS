<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from "vue"
import { type FormInstance, ElMessage, ElPopconfirm } from "element-plus"
import { addUserApi, getAllUsersAPI, editUserApi, delUserApi, getUsersAPI } from "@/api/admin/user-management"
import { usePagination } from "@/hooks/usePagination"

/* 超管账号 */

// TODU：类型提升
const isSearch = ref<boolean>(false)
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const tableData = ref<any>([])
const searchFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)
const currentUpdateId = ref<undefined | number>(undefined)
const searchData = reactive({
  idCardNumber: "",
  email: "",
  realName: "",
  roleName: ""
})
const formData = reactive({
  realName: "",
  email: "",
  password: "",
  idCardNumber: "",
  roleName: "user",
  userId: ""
})
const formRef = ref<FormInstance | null>(null)

const getTableData = () => {
  if (isSearch.value) {
    return
  }
  loading.value = true
  getAllUsersAPI({
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
  getUsersAPI({
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

function getStatusLabel(taskStatus: any) {
  const statusMap: { [key: string]: string } = {
    user: "用户",
    admin: "管理员",
    super: "超级管理员"
  }

  return statusMap[taskStatus as number] || "未知状态"
}

const resetForm = () => {
  currentUpdateId.value = undefined
  formData.email = ""
  formData.idCardNumber = ""
  formData.password = ""
  formData.realName = ""
  formData.roleName = ""
}

const handleUpdate = (row: any) => {
  currentUpdateId.value = row.userId
  formData.userId = row.userId
  formData.email = row.email
  formData.idCardNumber = row.idCardNumber
  formData.password = row.password
  formData.realName = row.realName
  formData.roleName = row.roleName
  dialogVisible.value = true
}

const resetSearch = () => {
  isSearch.value = false
  searchFormRef.value?.resetFields()
  const defaultSearchData = {
    idCardNumber: "",
    email: "",
    realName: "",
    roleName: ""
  }
  Object.assign(searchData, defaultSearchData)
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addUserApi(formData).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        editUserApi(formData).then(() => {
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

async function handleDelete(id: number) {
  await delUserApi(id)
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
  // const res = getAllUsersAPI({
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
        <el-form-item label="角色">
          <el-select v-model="searchData.roleName" placeholder="请选择角色" clearable>
            <el-option label="用户" value="user" />
            <el-option label="管理员" value="admin" />
            <el-option label="超级管理员" value="super" />
          </el-select>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="searchData.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button @click="dialogVisible = true">新增人员</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="index" width="50" align="center" />
          <el-table-column prop="realName" label="姓名" align="center" />
          <el-table-column prop="roleName" label="角色" align="center">
            <template #default="scope">
              {{ getStatusLabel(scope.row.roleName) }}
            </template>
          </el-table-column>
          <el-table-column prop="idCardNumber" label="身份证号码" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />

          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-popconfirm
                title="确认删除该任务吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row.userId)"
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
      :title="currentUpdateId === undefined ? '新增人员' : '修改人员'"
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
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formData.roleName" placeholder="请选择角色">
            <el-option label="用户" value="user" />
            <el-option label="管理员" value="admin" />
            <el-option label="超级管理员" value="super" />
          </el-select>
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
