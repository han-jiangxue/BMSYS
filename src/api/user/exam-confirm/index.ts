import { request } from "@/utils/service"

enum Api {
  // 确认考试
  ExamConfirm = "/examTask/confirm",
  // 取消考试
  ExamCancel = "/examTask/cancel"
}

export function examConfirmApi() {
  return request({
    url: Api.ExamConfirm,
    method: "get"
  })
}

export function examCancelApi(params: any) {
  return request({
    url: Api.ExamCancel,
    method: "get",
    params
  })
}
