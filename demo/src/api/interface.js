import request from '@/utils/request'

// 查询货柜信息列表
export function login(data) {
  return request({
    url: '/sysUser/login',
    method: 'post',
    data: data
  })
}

export function purchase(data){
  return request({
    url: '/goods/purchase',
    method: 'post',
    data: data
  })
}

export function getPageList(data){
  return request({
    url: '/goodsStockChangeLog/getPageList',
    method: 'post',
    data: data
  })
}

export function getOrdersPageList(data){
  return request({
    url: '/orders/getPageList',
    method: 'post',
    data: data
  })
}


export function getOrdersDetails(data){
  return request({
    url: '/ordersDetails/getList',
    method: 'post',
    data: data
  })
}

export function increase(data){
  return request({
    url: '/ordersPickingLog/increase ',
    method: 'post',
    data: data
  })
}

export function reduce(data){
  return request({
    url: '/ordersPickingLog/reduce',
    method: 'post',
    data: data
  })
}

export function completePicking(data){
  return request({
    url: '/orders/completePicking',
    method: 'post',
    data: data
  })
}
export function printTicket(data){
  return request({
    url: '/orders/printTicket',
    method: 'post',
    data: data
  })
}

export function getGoodsBaseList(data){
  return request({
    url: '/goodsBase/getPageList',
    method: 'post',
    data: data
  })
}

export function updateCost(data){
  return request({
    url: '/goodsBase/updateCost',
    method: 'post',
    data: data
  })
}

export function updateGoodsBaseInfo(data){
  return request({
    url: '/goodsBase/update',
    method: 'post',
    data: data
  })
}
export function getGoodsBaseInfoById(id){
  return request({
    url: '/goodsBase/getById/' + id,
    method: 'get',
  })
}
export function getGoodsStockChangeLog(data){
  return request({
    url: '/goodsStockChangeLog/getPageList',
    method: 'post',
    data: data
  })
}
export function doImportCost(data){
  return request({
    url: '/goodsBase/doImportCost',
    method: 'post',
    data: data
  })
}
//saveImportCost
export function saveImportCost(data){
  return request({
    url: '/goodsBase/saveImportCost',
    method: 'post',
    data: data
  })
}


export function doImport(data){
  return request({
    url: '/goodsBase/doImport',
    method: 'post',
    data: data
  })
}
//saveImportCost
export function saveImport(data){
  return request({
    url: '/goodsBase/saveImport',
    method: 'post',
    data: data
  })
}
//goodsBase/getByBarcode

export function getByBarcode(data){
  return request({
    url: '/goodsBase/getByBarcode',
    method: 'post',
    data: data
  })
}

export function deleteGoodsBaseByIds(id){
  return request({
    url: '/goodsBase/deleteByIds/' + id,
    method: 'post',

  })
}
