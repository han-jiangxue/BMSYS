import { request } from "@/utils/service"

enum Api {
  // 获取公告
  GetAllNotice = "/stuannnouncement/showall"
}

export function getAllNoticeAPI() {
  return request({
    url: Api.GetAllNotice,
    method: "get"
  })
}
