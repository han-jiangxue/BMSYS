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
  UpdateNotice = "/announcement/manage/update"
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
