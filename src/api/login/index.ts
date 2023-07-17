import { request } from "@/utils/service"
import type * as Login from "./types/login"

enum Api {
  // 获取验证码
  LoginCode = "/user/captcha",
  // 登录
  Login = "/user/login",
  // 获取公钥
  GetPublicKey = "/user/getPublicKey",
  // 获取用户信息
  UserInfo = "/test/userinfo",
  // 邮箱验证码
  EmailCode = "/user/registerCode",
  // 注册
  Register = "/user/register",
  // 注销
  Logout = "/user/logout",
  // 修改密码
  ResetPassword = "/user/reset/password",
  // 修改密码验证码
  ResetPasswordCode = "/user/code"
}

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: `${Api.LoginCode}`,
    method: "get"
  })
}

/** 获取修改密码验证码 */
export function getResetPasswordCodeApi(data: any) {
  return request<Login.LoginCodeResponseData>({
    url: `${Api.ResetPasswordCode}`,
    method: "get",
    data
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

export function getPublicKeyApi() {
  return request({
    url: Api.GetPublicKey,
    method: "get"
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

/** 注销 */
export function logoutApi() {
  return request<Login.UserInfoResponseData>({
    url: Api.Logout,
    method: "get"
  })
}

/** 注册 */
export function registerApi(data: Login.RegisterParams, headers: any) {
  return request<Login.LoginResponseData>({
    url: `${Api.Register}`,
    method: "post",
    data,
    headers
  })
}

/** 修改密码 */
export function ResetPassword(data: Login.ResetPasswordParams, headers: any) {
  return request<Login.LoginResponseData>({
    url: `${Api.ResetPassword}`,
    method: "post",
    data,
    headers
  })
}
