import request from '@/utils/request'
import store from '@/store'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/sysMenu/getListByUserId/' + store.getters.userId,
    method: 'get'
  })
}
