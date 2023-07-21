import { request } from "@/utils/service"

enum Api {
  // 获取成绩
  GetScore = "/achievement/getScore",
  // 获取考试任务
  GetExamTask = "/examTask/getExamInfo"
}

export function getExamTaskApi() {
  return request({
    url: Api.GetExamTask,
    method: "get"
  })
}

export function getScoreApi(params: any) {
  return request({
    url: Api.GetScore,
    method: "post",
    params
  })
}
