import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/Layout/index'
import { push } from 'echarts/lib/component/dataZoom/history'
// import ParentView from '@/components/ParentView';
// import InnerLink from '@/layout/components/InnerLink'
const indexRouter = {
  name:"首页",
  code:'/index',
  url:'index',
  icon:'',
  id:"0_index",
  children_list:[],
}
const permission = {
  state: {
    routes: [],
    addRoutes: [],
    sidebarRouters:[], // 侧边栏路由
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const rdata = JSON.parse(JSON.stringify(res.data));
          let sdata = JSON.parse(JSON.stringify(res.data));
          sdata.unshift(indexRouter);
          const sidebarRoutes = sdata;
          let rewriteRoutes= filterAsyncRouter(rdata);
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true });
          commit('SET_ROUTES', rewriteRoutes);
          commit('SET_SIDEBAR_ROUTERS', sidebarRoutes);
          resolve(rewriteRoutes)
        })
      })
    }
  }
}


// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  let routers = [];
  asyncRouterMap.forEach((item) =>{
   let data = {}
    let children = item.children_list;
    if (children && children.length>0){
      data = {
        alwaysShow: true,
        children: filterAsyncRouter(children),
        component: Layout,
        hidden: false,
        path: item.code,
        redirect: "noRedirect",
        name:item.name,
        meta:{
          id:item.id,
          title: item.name,
          icon: item.icon,
          affix: false
        },
      }
    }else {
      data = {
        alwaysShow: true,
        component: loadView(item.url),
        path: item.code,
        name:item.name,
        meta:{
          id:item.id,
          title: item.name,
          icon: item.icon,
          affix: false
        },
        hidden: false,
      }
    }
    routers.push(data)
  })
  return routers;
}

function filterTreeDataToRouter(treeData){
  let data = {}
  let children = treeData.children_list;
  if (children && children.length>0){
    data = {
      alwaysShow: true,
      children: filterTreeDataToRouter(treeData),
      component: Layout,
      hidden: false,
      path: treeData.code,
      redirect: "noRedirect",
      name:treeData.name,
      meta:{
        id:treeData.id,
        title: treeData.name,
        icon: treeData.icon,
        affix: false
      },
    }
  }else {
    data = {
      id:treeData.id,
      alwaysShow: true,
      children: [],
      component: loadView(treeData.url),
      hidden: false,
      path: treeData.code,
      name:treeData.name,
      meta:{
        id:treeData.id,
        title: treeData.name,
        icon: treeData.icon,
        affix: false
      },
    }
  }
}


function filterChildren(childrenMap, lastRouter = false) {
  var children = []

  return children
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
