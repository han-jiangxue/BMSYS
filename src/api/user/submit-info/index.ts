import { request } from "@/utils/service"

enum Api {
  // 确认提交
  ConfirmUpload = "/info/upload"
}

export function confirmUploadApi() {
  return request({
    url: Api.ConfirmUpload,
    method: "get"
  })
}
