import { request } from "@/utils/service"
import type * as ScoreType from "./types"

enum Api {
  // 获取考试任务
  GetExamTask = "/examTask/getExamInfo",
  // 查询某次任务成绩
  GetScore = "/achievement/getScores",
  // 导入成绩
  ImportScore = "/achievement/importScore",
  // 删除成绩
  DelScore = "/achievement/deleteScore",
  // 新增成绩
  AddScore = "/achievement/addScore",
  // 修改成绩
  EditScore = "/achievement/updateScore",
  // 批量删除
  DelScoreList = "/achievement/deleteScoreList"
}

export function getExamTaskAPI() {
  return request({
    url: Api.GetExamTask,
    method: "get"
  })
}

export function getScoreAPI(params: any) {
  return request({
    url: Api.GetScore,
    method: "get",
    params
  })
}

export function deleteScoreAPI(params: any) {
  return request({
    url: Api.DelScore,
    method: "get",
    params
  })
}

export function deleteScoreListAPI(data: any) {
  return request({
    url: Api.DelScoreList,
    method: "post",
    data
  })
}

export function importScoreAPI(data: any) {
  return request({
    url: Api.ImportScore,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  })
}

/**
 * 管理员增加一条成绩
 * @returns
 */
export function addScoreAPI(data: ScoreType.AddScoreParams) {
  return request({
    url: Api.AddScore,
    method: "post",
    data
  })
}

export function editScoreAPI(data: ScoreType.AddScoreParams) {
  return request({
    url: Api.EditScore,
    method: "post",
    data
  })
}
