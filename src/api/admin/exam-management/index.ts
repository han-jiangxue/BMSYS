import { request } from "@/utils/service"
import type * as Exam from "./types"

enum Api {
  // 获取考试任务
  GetExam = "/examTask/queryTaskList",
  // 添加考试任务
  AddExam = "/examTask/add",
  // 取消考试
  CancelExam = "/examTask/cancel",
  // 确认考试
  ConfirmExam = "/examTask/confirm",
  // 删除考试任务
  DeleteExam = "/examTask/delete",
  // 编辑考试任务
  EditExam = "/examTask/edit",
  // 启动考试任务
  OpenExam = "/examTask/start",
  // 搜索考试任务
  GetSearchExam = "/examTask/search"
}

export function getExamAPI(page: Exam.GetExamParams) {
  return request({
    url: `${Api.GetExam}/${page.currentPage}?pageSize=${page.size}`,
    method: "get"
  })
}

export function getExamSearchAPI(data: Exam.GetExamSearchParams) {
  return request({
    url: `${Api.GetSearchExam}?pageIndex=${data.currentPage}&pageSize=${data.size}&taskName=${data.taskName}`,
    method: "get"
  })
}

export function openExamAPI(taskId: number) {
  return request({
    url: `${Api.OpenExam}/${taskId}`,
    method: "get"
  })
}

export function delExamAPI(taskId: number) {
  return request({
    url: `${Api.DeleteExam}/${taskId}`,
    method: "get"
  })
}

/**
 * 添加任务
 * @data {object} data ExamTaskVO
 * @data {string} data.task 任务名称
 * @data {object} data.startTime 开始时间,格式yyyy/MM/dd
 * @data {object} data.endTime 结束时间,格式yyyy/MM/dd
 * @data {string} data.remark 备注
 * @returns
 */
export function AddExamApi(data: Exam.AddExamParams) {
  return request({
    url: Api.AddExam,
    method: "post",
    data
  })
}

export function EditExamApi(data: Exam.AddExamParams, taskId: number) {
  return request({
    url: `${Api.EditExam}/${taskId}`,
    method: "post",
    data
  })
}
