import request from '@/utils/request'

// 获取路由
export function listMenu(data){
  return request({
    url: '/sysMenu/getByTree',
    method: 'post',
    data:data
  })
}
// 获取路由详情
export function getMenuById(id){
  return request({
    url:'/sysMenu/getById/' + id,
    method:'get'
  })
}

// 新增路由详情
export function saveMenu(data){
  return request({
    url:'/sysMenu/save',
    method:'post',
    data:data
  })
}
// 修改路由详情
export function updateMenu(data){
  return request({
    url:'/sysMenu/update',
    method:'post',
    data:data
  })
}


// 删除路由详情
export function deleteMenuById(ids){
  return request({
    url:'/sysMenu/deleteByIds/' + ids,
    method:'get'
  })
}
