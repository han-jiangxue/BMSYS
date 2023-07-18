export interface AddFillingTaskParams {
  taskName: string
  startTime: string
  endTime: string
  remark?: string
  attachmentPath: string
  draftOrNot: boolean
}

export interface EditFillingTaskParams {
  taskId: string
  taskName: string
  startTime: string
  endTime: string
  remark?: string
  attachmentPath: string
  draftOrNot: boolean
}

export interface CaptchaRes {
  code: number
  message: string
  date: string
  data: Record<string, unknown>
}
