import  messageBoxVue from '@/views/tool/Login'
import Vue from 'vue'


const LoginBox = {};

const MessageBoxInstance = Vue.extend(messageBoxVue);
let currentMsg
const initInstance = () => {
  currentMsg = new MessageBoxInstance();
  let msgBoxEl = currentMsg.$mount().$el;
  document.body.appendChild(msgBoxEl);
};

LoginBox.install = function(options) {
  //+在Vue的原型上添加实例⽅法，以全局调⽤++Vue.prototype
  Vue.prototype.$login = {
    showMsgBox(options) {
      if(!currentMsg){
        initInstance();
      }
      if(typeof options === 'string'){
        currentMsg.content = options;
      }else if(typeof  options === 'object'){
        Object.assign(currentMsg,options);
      }
      return currentMsg.showMsgBox().then(val =>{
        currentMsg = null;
        return Promise.resolve(val);
      }).catch(err =>{
        currentMsg = null;
        return Promise.reject(err);
      });
    }
  }
}
LoginBox.show = function(options) {
  console.log(1)
  if(!currentMsg){
    initInstance();
  }
  if(typeof options === 'string'){
    currentMsg.content = options;
  }else if(typeof  options === 'object'){
    Object.assign(currentMsg,options);
  }
  return currentMsg.showMsgBox().then(val =>{
    currentMsg = null;
    return Promise.resolve(val);
  }).catch(err =>{
    currentMsg = null;
    return Promise.reject(err);
  });
}
export default LoginBox;
