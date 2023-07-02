import { request } from "@/utils/service"

enum Api {
  // 获取信息
  GetInfo = "/info/get",
  // 信息填报
  AddInfo = "/info/submit"
}

/* 获取信息填报 */
export function getInfoAPI() {
  return request({
    url: Api.GetInfo,
    method: "get"
  })
}

/** 信息填报 */
export function addInfoApi() {
  return request({
    url: Api.AddInfo,
    method: "post"
  })
}
