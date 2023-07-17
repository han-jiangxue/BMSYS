import { request } from "@/utils/service"
import type * as AddInfo from "./types"

enum Api {
  // 获取信息
  GetInfo = "/info/get",
  // 信息填报
  AddInfo = "/info/submit",
  // 更新填报
  UpdateInfo = "/info/update",
  // 获取图片
  GetPicture = "/file/downloadPhoto",
  // 导出文件
  GetWordFile = "/file/downWord"
}

/**
 * 获取信息填报
 * @returns
 */
export function getInfoAPI() {
  return request<AddInfo.GetInfoResponseData>({
    url: Api.GetInfo,
    method: "get"
  })
}

/**
 * 信息填报
 * @param {object} params 用户信息视图类
 * @param {number} params.gender 性别,根据字典来填
 * @param {string} params.phoneNumber 手机号码
 * @param {string} params.nation 民族
 * @param {string} params.position 籍贯
 * @param {object} params.birthday 出生年月,具体到天，日期格式按照yyyy/MM/dd HH:mm:ss
 * @param {number} params.politicalOutlook 政治面貌,根据字典来填
 * @param {object} params.partyJoiningTime 入党时间，具体到天，日期格式按照yyyy/MM/dd HH:mm:ss
 * @param {number} params.maritalStatus 婚姻状况,根据字典来填
 * @param {string} params.englishProficiency 英语水平
 * @param {object} params.englishScore 英语成绩
 * @param {string} params.homeLocation 家庭所在地
 * @param {string} params.currentLocation 现所在地
 * @param {string} params.civilServiceExam 参加公务员或选调生报名考试及拟录取情况,有则如实填写具体情况，没有则填写“无”
 * @param {string} params.educationBackground 就读学校及专业,给不是本科学历填写的，如果是本科就可以不用填
 * @param {string} params.undergraduateUniversity 本科就读学校
 * @param {string} params.undergraduateMajor 本科就读专业
 * @param {string} params.masterUniversity 硕士就读学校
 * @param {string} params.masterMajor 硕士就读专业
 * @param {string} params.phdUniversity 博士就读学校
 * @param {string} params.phdMajor 博士就读专业
 * @param {string} params.personalExperience 个人经历
 * @param {string} params.studentLeadershipExperience 担任学生干部或从事学生教育管理工作经历
 * @param {string} params.academicHonors 学习期间所获荣誉称号情况
 * @param {string} params.disciplinaryRecord 何时何地何原因受过何种处分
 * @param {string} params.otherSupportingDocuments 其他支撑材料
 * @returns
 */
export function addInfoApi(data: AddInfo.AddInfoRequestData) {
  return request({
    url: Api.AddInfo,
    method: "post",
    data
  })
}

export function updateInfoApi(data: AddInfo.AddInfoRequestData) {
  return request({
    url: Api.UpdateInfo,
    method: "post",
    data
  })
}

export function getPictureApi() {
  return request({
    url: Api.GetPicture,
    method: "get",
    responseType: "blob"
  })
}

export function getWordFileApi() {
  return request({
    url: Api.GetWordFile,
    method: "get",
    responseType: "blob"
  })
}
