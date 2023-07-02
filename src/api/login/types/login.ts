export interface CaptchaRes {
  code: number
  message: string
  date: string
  data: Record<string, unknown>
}

export interface LoginParams {
  idCardNumber: string
  password: string
  rememberMe?: boolean
  code?: string
  uuid?: string
}

interface UserInfoData {
  userId: string
  idCardNumber: string
  password: string
  email: string
  realName: string
  nickname: string
  roleName: string
}

export type LoginCodeResponseData = CaptchaRes

export type LoginRequestData = LoginParams

export type LoginResponseData = ApiResponseData<any>

export type UserInfoResponseData = ApiResponseData<UserInfoData>
