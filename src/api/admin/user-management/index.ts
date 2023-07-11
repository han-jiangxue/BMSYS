import { request } from "@/utils/service"
enum Api {
  // 获取所有用户
  GetAllUsers = "/super/all",
  // 新增用户
  AddUser = "/super/add",
  // 修改用户
  EditUser = "/super/delete",
  // 删除用户
  DeleteUser = "/super/delete",
  // 搜索用户
  GetUsers = "/super/search"
}

export function getUsersAPI(data: any) {
  return request({
    url: `${Api.GetUsers}?pageIndex=${data.currentPage}&pageSize=${data.size}`,
    method: "post",
    data
  })
}

export function getAllUsersAPI(data: any) {
  return request({
    url: `${Api.GetAllUsers}?pageIndex=${data.currentPage}&pageSize=${data.size}`,
    method: "post"
  })
}

/**
 * 新增用户
 * @data {object} data AddPeopleVO
 * @data {string} data.idCardNumber 身份证号
 * @data {string} data.password 密码
 * @data {string} data.email 邮箱
 * @data {string} data.realName 真实姓名
 * @data {string} data.nickname 网名
 * @data {string} data.roleName 角色名需要按照字典写
 * @returns
 */
export function addUserApi(data: any) {
  return request({
    url: Api.AddUser,
    method: "post",
    data
  })
}

export function editUserApi(data: any) {
  return request({
    url: `${Api.EditUser}/${data.userId}`,
    method: "post",
    data
  })
}

export function delUserApi(data: any) {
  return request({
    url: `${Api.EditUser}/${data}`,
    method: "get",
    data
  })
}
