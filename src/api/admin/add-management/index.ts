import { request } from "@/utils/service"
import type * as Filling from "./types"

enum Api {
  // 获取考试任务
  GetFillingTask = "/task/getFillingTaskList",
  // 添加任务
  AddTask = "/task/addFillingTask",
  // 删除任务
  DelTask = "/task/deleteTask",
  // 修改任务
  EditTask = "/task/updateTask",
  // 开启任务
  OpenTask = "/task/startTask",
  // 上传文件
  AddFile = "/exam-info-stu/uploadWordFile"
}

export function getFillingTaskApi(params: any) {
  return request({
    url: Api.GetFillingTask,
    method: "get",
    params
  })
}

export function deleteTaskApi(params: any) {
  return request({
    url: Api.DelTask,
    method: "get",
    params
  })
}

export function openTaskApi(params: any) {
  return request({
    url: Api.OpenTask,
    method: "get",
    params
  })
}

export function addFillingTaskApi(data: Filling.AddFillingTaskParams) {
  return request({
    url: Api.AddTask,
    method: "post",
    data
  })
}

export function editTaskApi(data: Filling.EditFillingTaskParams) {
  return request({
    url: Api.EditTask,
    method: "post",
    data
  })
}

export function addFileAPI(data: any) {
  return request({
    url: Api.AddFile,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  })
}
