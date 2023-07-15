import { request } from "@/utils/service"
import type * as Users from "./types"

enum Api {
  // 获取填报信息
  GetAddInfo = "/exam/info/",
  // 审核
  Review = "/exam/review",
  // 删除
  Delete = "/exam/delete",
  // 搜索
  Search = "/exam/info/search",
  // 详情
  GetDetail = "/exam/details"
}

export function getAddInfoApi(data: any) {
  return request({
    url: `${Api.GetAddInfo}?pageIndex=${data.currentPage}&pageSize=${data.size}`,
    method: "get"
  })
}

export function getDetailApi(data: number) {
  return request({
    url: `${Api.GetDetail}/${data}`,
    method: "get"
  })
}

export function reviewAPI(data: any) {
  return request({
    url: Api.Review,
    method: "post",
    data
  })
}

export function deleteApi(data: number[]) {
  return request({
    url: Api.Delete,
    method: "post",
    data
  })
}

export function searchApi(data: Users.SearchUserParams) {
  return request({
    url: `${Api.Search}?pageIndex=${data.currentPage}&pageSize=${data.size}`,
    method: "post",
    data: {
      pageIndex: data.currentPage,
      pageSize: data.size,
      halfYear: data.halfYear,
      idCardNumber: data.idCardNumber,
      realName: data.realName
    }
  })
}
