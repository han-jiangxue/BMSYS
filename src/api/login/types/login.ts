export interface UserInfoData {
  userId: string
  idCardNumber: string
  password: string
  email: string
  realName: string
  nickname: string
  roleName: string
}

interface CaptchaRes {
  code: number
  message: string
  date: string
  data: Record<string, unknown>
}

interface LoginParams {
  idCardNumber: string
  password: string
  rememberMe?: boolean
  code?: string
  uuid?: string
}

export type LoginCodeResponseData = CaptchaRes

export type LoginRequestData = LoginParams

export type LoginResponseData = ApiResponseData<any>

export type UserInfoResponseData = ApiResponseData<UserInfoData>
