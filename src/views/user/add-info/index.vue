<script lang="ts" setup>
import { regionData } from "element-china-area-data"
import { CascaderOption, ElMessage, ElMessageBox, ElLoading } from "element-plus"
import { onMounted, reactive, ref, watchEffect } from "vue"
import { getInfoAPI, addInfoApi, updateInfoApi, getPictureApi, getWordFileApi } from "@/api/user/add-info"
import { getUserInfoApi } from "@/api/login"
import { formatDateTime } from "@/utils"
import { getToken } from "@/utils/cache/cookies"
import { getLocation, getPositionArray } from "@/utils/location"
import type { AddInfoRequestData, GetInfoResponseData } from "@/api/user/add-info/types"
import type { UserInfoData } from "@/api/login/types/login"
import { saveAs } from "file-saver"
import { getRegistrationStatueApi } from "@/api/user/add-info"

// TODU: 空值校验

const fileList = ref()
const picUrl = import.meta.env.VITE_BASE_API + "/file/uploadPhoto"
const token = getToken()
const isLoaded = ref(false)
const infoForm: AddInfoRequestData = reactive({})
const userInfo = ref<UserInfoData>()
const isDialogShow = ref({
  addPicVisible: false,
  otherLeverVisible: false
})

async function init() {
  isLoaded.value = false
  getRegistrationStatueApi().then((res: any) => {
    registerStatue.value = res?.data
  })
  userInfo.value = { ...(await getUserInfoApi()).data }
  // if (registerStatue.value?.fillingStatus === 2) {
  //   const res: GetInfoResponseData = await getInfoAPI()
  //   Object.assign(infoForm, res.data)
  //   infoForm.position = getPositionArray(infoForm.position, regionData)
  // }
  const res: GetInfoResponseData = await getInfoAPI()
  Object.assign(infoForm, res.data)
  if (infoForm.position) {
    infoForm.position = getPositionArray(infoForm.position, regionData)
  }
  if (registerStatue.value?.hasPhoto) {
    getPicUrl()
  }
  isLoaded.value = true
}

async function handleSubmit(type: "submit" | "update") {
  infoForm.birthday = formatDateTime(infoForm.birthday as string)
  infoForm.partyJoiningTime = formatDateTime(infoForm.partyJoiningTime as string)
  infoForm.position = getLocation(infoForm.position as unknown as [])
  if (type === "submit") {
    await addInfoApi(infoForm).then((res: any) => {
      if (res.code === 200) {
        ElMessage.success("提交成功")
      }
    })
  } else if (type === "update") {
    await updateInfoApi(infoForm).then((res: any) => {
      if (res.code === 200) {
        ElMessage.success("更新成功")
      }
    })
  }
  init()
}

const getPicUrl = async () => {
  await getPictureApi().then((res: any) => {
    const reader = new FileReader()
    reader.readAsDataURL(res)
    reader.onload = () => {
      fileList.value = reader.result as unknown as any
    }
  })
}

// TODU: 貌似无法二次上传
const handleBeforeUpload = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    ElMessageBox.confirm(
      "所有上传扫描件均为jpg格式，图片清晰，不超过1M，上传前jpg文件以“姓名+材料名称”命名。确定上传吗？",
      "上传确认",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        // 判断文件大小是否超过1MB
        const fileSizeLimit = 1 * 1024 * 1024 // 1MB
        if (file.size > fileSizeLimit) {
          ElMessage({
            type: "warning",
            message: "文件大小超过1MB，请选择文件大小不超过1MB的图片。"
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

const handleSuccess = (res: any) => {
  if (res.code === 200) {
    getPicUrl()
    ElMessage.success("上传成功！")
    setTimeout(() => {
      isDialogShow.value.addPicVisible = false
    }, 2000)
  }
}

const handleExportWord = async () => {
  const downloadLoadingInstance = ElLoading.service({
    text: "正在下载文件，请稍候",
    lock: true,
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    const response: any = await getWordFileApi()
    saveAs(response, `${userInfo.value?.realName}报名表.doc`)
    downloadLoadingInstance.close()
    ElMessage.success("文件下载完成")
  } catch (error) {
    console.error("导出Word文件出错", error)
    ElMessage.error("下载文件出现错误！")
    downloadLoadingInstance.close()
  }
}

watchEffect(() => {
  if (infoForm.englishProficiency === "其他") {
    infoForm.englishProficiency = ""
    isDialogShow.value.otherLeverVisible = true
  }
})

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

onMounted(async () => {
  init()
})
</script>

<template>
  <div class="app-container">
    <el-card v-if="isLoaded">
      <div class="p-5 overflow-x-auto">
        <div class="w-full! flex justify-between">
          <el-form :inline="true" :model="infoForm" label-position="left" class="w-1000px">
            <el-form-item label="姓&emsp;&emsp;名">
              <el-input disabled v-model="userInfo!.realName" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input disabled v-model="userInfo!.idCardNumber" placeholder="请输入身份证号" clearable />
            </el-form-item>
            <el-form-item label="性&emsp;&emsp;别">
              <el-select v-model="infoForm.gender" placeholder="请选择性别" clearable>
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="infoForm.phoneNumber" placeholder="请输入手机号码" clearable />
            </el-form-item>
            <el-form-item label="民&emsp;&emsp;族">
              <el-input v-model="infoForm.nation" placeholder="请输入民族" clearable />
            </el-form-item>
            <el-form-item label="电子邮箱">
              <el-input v-model="userInfo!.email" placeholder="请输入电子邮箱" clearable />
            </el-form-item>
            <el-form-item label="籍&emsp;&emsp;贯">
              <el-cascader
                v-model="infoForm.position"
                placeholder="请选择籍贯"
                clearable
                :options="regionData as CascaderOption[]"
              />
            </el-form-item>
            <el-form-item label="家庭住址">
              <el-input v-model="infoForm.homeLocation" placeholder="请输入家庭住址" clearable />
            </el-form-item>
            <el-form-item label="现所在地">
              <el-input v-model="infoForm.currentLocation" placeholder="请输入现所在地" clearable />
            </el-form-item>
            <el-form-item label="出生时间">
              <el-date-picker v-model="infoForm.birthday" type="date" placeholder="请选择时间" />
            </el-form-item>
            <el-form-item label="婚姻状况">
              <el-select v-model="infoForm.maritalStatus" placeholder="请选择婚姻状况" clearable>
                <el-option label="未婚" :value="1" />
                <el-option label="已婚" :value="2" />
                <el-option label="离异" :value="3" />
                <el-option label="丧偶" :value="4" />
              </el-select>
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-select v-model="infoForm.politicalOutlook" placeholder="请选择政治面貌">
                <el-option label="中共党员" :value="1" />
                <el-option label="中共预备党员" :value="2" />
                <el-option label="共青团员" :value="3" />
                <el-option label="群众" :value="4" />
              </el-select>
            </el-form-item>
            <el-form-item label="入党时间">
              <el-date-picker v-model="infoForm.partyJoiningTime" type="date" placeholder="请选择时间" />
            </el-form-item>
            <el-form-item label="英语水平">
              <el-select v-model="infoForm.englishProficiency" placeholder="请选择英语水平">
                <el-option label="CET4" value="CET4" />
                <el-option label="CET6" value="CET6" />
                <el-option label="TEM4" value="TEM4" />
                <el-option label="TEM8" value="4TEM8" />
                <el-option label="IELTS" value="5IELTS" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
            <el-form-item label="英语分数">
              <el-input v-model.number="infoForm.englishScore" placeholder="请输入英语分数" clearable />
            </el-form-item>
            <el-form-item label="本科学校">
              <el-input v-model="infoForm.undergraduateUniversity" placeholder="请输入本科就读学校" clearable />
            </el-form-item>
            <el-form-item label="本科专业">
              <el-input v-model="infoForm.undergraduateMajor" placeholder="请输入本科就读专业" clearable />
            </el-form-item>
            <el-form-item label="硕士学校">
              <el-input v-model="infoForm.masterUniversity" placeholder="请输入硕士就读学校" clearable />
            </el-form-item>
            <el-form-item label="硕士专业">
              <el-input v-model="infoForm.masterMajor" placeholder="请输入硕士就读专业" clearable />
            </el-form-item>
            <el-form-item label="博士学校">
              <el-input v-model="infoForm.phdUniversity" placeholder="请输入博士就读学校" clearable />
            </el-form-item>
            <el-form-item label="博士专业">
              <el-input v-model="infoForm.phdMajor" placeholder="请输入博士就读专业" clearable />
            </el-form-item>
          </el-form>
          <div class="w-220px">
            <div class="flex w-100% justify-center flex-col items-center">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :limit="1"
                :action="picUrl"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                :headers="{ token: token }"
              >
                <img v-if="fileList" :src="fileList" class="w-30" />
                <el-icon class="text-40!" v-else><upload-filled /></el-icon>
                <div class="mt-4">上传正面免冠证件照1张</div>
                <div class="text-2">（1寸2.5*3.5cm，413*295像素，jpg格式</div>
                <div class="text-2">上传时jpg文件命名为“姓名+证件照”）</div>
              </el-upload>
              <div class="mt-2">注意：请保存后再上传图片</div>
            </div>
          </div>
        </div>
        <el-form :inline="true" :model="infoForm" label-position="top">
          <el-form-item label="个人经历">
            <el-input
              v-model="infoForm.personalExperience"
              placeholder="填写提示：请严格按照格式填写，从高中-至今填写，保持时间连续性，不出现假期以外的时间空档，请填写学校、学院、专业名称的全称。格式：
1.年月日-年月日，省市**中学，高中。（换行）
2.年月日-年月日，省市大学学院**专业，本科。（换行）
3.年月日-年月日，省市**单位就业并复习考研。（换行）
4.年月日-年月日，省市大学学院**专业，硕士研究生。（换行）
5.年月日-至今，省市大学学院专业，博士研究生。（换行）
……"
              type="textarea"
              class="w-140!"
              :rows="8"
              clearable
            />
          </el-form-item>
          <el-form-item label="担任学生干部或从事学生教育管理工作经历">
            <el-input
              v-model="infoForm.studentLeadershipExperience"
              placeholder="填写提示：填写大学以来的经历，按照重要程度从高至低填写，请填写单位、组织及职务的全称，不限项。格式：
1.年月日-年月日，担任**大学学生会主席。（换行）
2.年月日-年月日，担任大学学院学生会主席。（换行）
3.年月日-至今，担任大学学院班班长。（换行）
……"
              type="textarea"
              class="w-140!"
              :rows="8"
              clearable
            />
          </el-form-item>

          <el-form-item label="学习期间所获荣誉称号情况">
            <el-input
              v-model="infoForm.academicHonors"
              placeholder="填写提示：仅填写荣誉称号或奖学金，获奖按照国家级、省级、校（市）级、院（县）级顺序逐级填写，荣誉称号写清类型、级别和全称，颁奖单位与获奖证书落款保持一致，如出现多部门共同颁奖，只写第一颁奖单位，限填6项。格式：
1.年月**日，获……荣誉称号，颁奖单位：………………。（换行）
2.年月**日，获……奖学金，颁奖单位：………………。（换行）
……"
              type="textarea"
              class="w-140!"
              :rows="8"
              clearable
            />
          </el-form-item>

          <el-form-item label="何时何地何原因受过何种处分">
            <el-input
              v-model="infoForm.disciplinaryRecord"
              placeholder="格式：1.年月**日，在……，因……原因，受到……处分。
……"
              type="textarea"
              class="w-140!"
              :rows="8"
              clearable
            />
          </el-form-item>
          <el-form-item label="其他支撑材料">
            <el-input
              v-model="infoForm.otherSupportingDocuments"
              placeholder="填写提示：计算机等级证书、学术成果、其他个人认为需要提供的材料等
格式：
1.年月**日，获得……证书。（换行）
2.年月**日，发表……论文。（换行）
……"
              type="textarea"
              class="w-140!"
              :rows="8"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="mt-24 mx-8" @click="handleSubmit('submit')">保存填写</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="mt-24 mx-8" @click="handleSubmit('update')">更新填写</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="mt-24 mx-8" @click="handleExportWord">导出文档</el-button>
          </el-form-item>
        </el-form>
        <!-- <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" class="w-60" @click="handleSubmit('submit')">保存</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="w-60" @click="isDialogShow.addPicVisible = true">头像上传</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="w-60" @click="handleSubmit('update')">更新</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="w-60" @click="handleExportWord">导出</el-button>
          </el-form-item>
        </el-form> -->
      </div>
    </el-card>

    <!-- Dialog -->
    <el-dialog
      v-model="isDialogShow.otherLeverVisible"
      title="请输入"
      width="30%"
      :show-close="false"
      draggable
      align-center
      center
    >
      <el-form :inline="true">
        <el-form-item label="英语水平">
          <el-input v-model="infoForm.englishProficiency" placeholder="请输入其他英语水平" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="isDialogShow.otherLeverVisible = false"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- <el-dialog
      v-model="isDialogShow.addPicVisible"
      title="头像上传"
      width="30%"
      :show-close="false"
      draggable
      align-center
      center
    >
      <div class="flex items-center justify-center mt--2 mb-2">注意：请保存后再上传图片</div>

      <div class="flex w-100% justify-center">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :limit="1"
          :action="picUrl"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :headers="{ token: token }"
        >
          <img v-if="fileList" :src="fileList" class="w-30" />
          <el-icon class="text-40!" v-else><upload-filled /></el-icon>
          <div class="mt-4">上传正面免冠证件照1张</div>
          <div class="text-2">（1寸2.5*3.5cm，413*295像素，jpg格式</div>
          <div class="text-2">上传时jpg文件命名为“姓名+证件照”）</div>
        </el-upload>
      </div>
    </el-dialog> -->
  </div>
</template>

<style scoped>
/* 图片上传样式 */
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 250px;
  padding: 0.5rem;
}
</style>
