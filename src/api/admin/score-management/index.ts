import { request } from "@/utils/service"

enum Api {
  // 获取考试任务
  GetExamTask = "/examTask/getExamInfo",
  // 查询某次任务成绩
  GetScore = "/achievement/getScores",
  // 导入成绩
  ImportScore = "/achievement/importScore"
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
