import Vue from 'vue'

import Cookies from 'js-cookie'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/demo.scss'
import App from './App'
import Pagination from "@/components/Pagination";
import DictTag from "@/components/DictTag";
import router from './router'
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
import './assets/icons' // icon
import './permission' // permission control
import store from './store'
// var less = require('less');

// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.handleTree = handleTree

// 全局组件挂载
// Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('DictTag', DictTag)
// Vue.component('RightToolbar', RightToolbar)
// Vue.component('Editor', Editor)
// Vue.component('FileUpload', FileUpload)
// Vue.component('ImageUpload', ImageUpload)
//
// Vue.use(directive)
// Vue.use(plugins)
// Vue.use(VueMeta)
// DictData.install()
// Vue.use(login)
Vue.use(ElementUI);
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

// Vue.use(Element, {
//   size: Cookies.get('size') || 'medium' // set element-ui default size
// })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
