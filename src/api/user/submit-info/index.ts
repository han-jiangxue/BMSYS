import { request } from "@/utils/service"

enum Api {
  // 确认提交
  ConfirmUpload = "/info/upload",
  // 获取填报任务
  GetAddTask = "/exam-info-stu/getLastPublishedFillingTask",
  // 下载文档
  GetFile = "/exam-info-stu/downloadFile"
}

export function confirmUploadApi() {
  return request({
    url: Api.ConfirmUpload,
    method: "get"
  })
}

export function getAddTaskApi() {
  return request({
    url: Api.GetAddTask,
    method: "get"
  })
}

export function getFileApi(params: any) {
  return request({
    url: Api.GetFile,
    method: "get",
    params,
    responseType: "blob"
  })
}
