import request from '@/utils/request'

// 登录方法
export function login(account, password, code, uuid) {
  const data = {
    account,
    password,
    code,
    uuid
  }
  return request({
    url: '/sysUser/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/sysUser/getLoginUser',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/sysUser/logout',
    method: 'post'
  })
}

