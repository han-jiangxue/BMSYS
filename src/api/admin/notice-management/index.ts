import { request } from "@/utils/service"
import type * as Notice from "./types"

enum Api {
  // 新增公告
  AddNotice = "/announcement/manage/create",
  // 按年份筛选
  NoticeBasedYear = "/announcement/manage/screen",
  // 按标题筛选
  NoticeBasedTitle = "/announcement/manage/search",
  // 更新公告
  UpdateNotice = "/announcement/manage/update",
  // 获取全部公告
  GetAllNotice = "/announcement/manage/showall",
  // 删除公告
  DeleteNotice = "/announcement/manage/delete",
  // 批量删除
  DeleteNoticeList = "/announcement/manage/delete/lot"
}

export function getGetAllNoticeAPI(params: any) {
  return request({
    url: Api.GetAllNotice,
    method: "get",
    params
  })
}

export function getNoticeBasedYearAPI(params: any) {
  return request({
    url: Api.NoticeBasedYear,
    method: "get",
    params
  })
}

export function getNoticeBasedTitleAPI(params: any) {
  return request({
    url: Api.NoticeBasedTitle,
    method: "get",
    params
  })
}

/**
 * 新增公告
 * @returns
 */
export function addNoticeAPI(data: Notice.AddNoticeParams) {
  return request({
    url: Api.AddNotice,
    method: "post",
    data
  })
}

export function editNoticeAPI(data: Notice.AddNoticeParams) {
  return request({
    url: Api.UpdateNotice,
    method: "post",
    data
  })
}

export function deleteNoticeAPI(id: number) {
  return request({
    url: `${Api.DeleteNotice}?id=${id}`,
    method: "post"
  })
}

export function deleteNoticeListAPI(data: any) {
  return request({
    url: Api.DeleteNoticeList,
    method: "post",
    data
  })
}
