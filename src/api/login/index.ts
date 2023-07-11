import { request } from "@/utils/service"
import type * as Login from "./types/login"

enum Api {
  // 获取验证码
  LoginCode = "/user/captcha",
  // 登录
  Login = "/user/login",
  // 获取用户信息
  UserInfo = "/test/userinfo",
  // 邮箱验证码
  EmailCode = "/user/registerCode"
}

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: `${Api.LoginCode}`,
    method: "get"
  })
}

/** 获取邮箱验证码 */
export function getEmailCodeApi(data: any) {
  return request<Login.LoginCodeResponseData>({
    url: `${Api.EmailCode}`,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData, headers: any) {
  return request<Login.LoginResponseData>({
    url: `${Api.Login}`,
    method: "post",
    data,
    headers
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: Api.UserInfo,
    method: "get"
  })
}
