export interface GetExamParams {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
}

export interface GetExamSearchParams {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /* 考试名称 */
  taskName: string
}

export interface AddExamParams {
  task?: string
  startTime?: string
  endTime?: string
  remark?: string
}
