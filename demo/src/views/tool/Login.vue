<template>
  <div class="login-box" v-show="visible">
    <div class="login-box__mask"/>
    <div class="login-content">
      <div class="login-form">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <h3 class="title">登录</h3>
          <el-form-item prop="account">
            <el-input v-model="loginForm.account" type="text" auto-complete="off" placeholder="账号">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item style="width:100%;">

          </el-form-item>
        </el-form>
      </div>
      <div class="content-button">
<!--        <el-button-->
<!--          class="button-primary"-->
<!--          @click="submitForm">登 &nbsp; 录</el-button>-->

        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">
            登 &nbsp; 录
            <!-- ({{count}} s) -->
          </span>
          <span v-else>登 录 中...</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/interface'
import { setToken } from '@/utils/auth'

export default {
  name: 'Login',
  props: {

  },
  watch:{

  },
  data() {
    return {
      visible:false,
      resolve:"",
      reject:"",
      promise:"",
      image:"message",
      type:"message",
      loading:false,
      loginForm:{
        account:"",
        password:""
        // account:"ops",
        // password:"123456"
      },
      loginRules:{

      }
    }
  },
  methods: {
    cancel() {
      this.visible = false;
      this.reject("cancel");
      this.remove();
    },
    async handleLogin(){
      let param = this.loginForm;
      const {code,data,msg} = await login(param);
      if (code === 200){
        setToken(data);
        this.visible = false;
        this.resolve(200);
        this.remove();
      }else {
        this.$message.error(msg);
      }
    },
    showMsgBox(){
      this.type = "message";
      this.visible = true;
      this.promise = new Promise((resolve,reject) => {
        this.resolve = resolve;
        this.reject = reject;
      }).catch(e =>{
        return e;
      })
      return this.promise;
    },
    remove(){
      setTimeout(()=>{
        this.destroy();
      })
    },
    destroy(){
      this.$destroy();
      document.body.removeChild(this.$el);
    },
  }
}
</script>

<style lang="scss" scoped>
.login-box{
  position: relative;
}
.login-box__mask{
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50000;
  height: 100%;
  width: 100%;
  margin: 0;
  background: #000000;
  opacity: 0.5;
}
.login-content{
  z-index: 50001;
  width: 400px;
  //height: 400px;
  background: #FFFFFF;
  box-shadow: 0 3px 6px 0 rgba(0,0,0,0.16);
  border-radius: 24px;
  position: fixed;
  box-sizing: border-box;
  padding: 1em;
  //min-width: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  //flex-wrap: wrap;
  //align-content: center;

  //justify-content: center;
}
.login-form{
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}
.content-button{
  width: 100%;
  height: 20%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  align-content: center;
  justify-content: center;
}
.title{
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  align-content: center;
  justify-content: center;
}
.button-primary{
  width: 50%;
  height: 50%;
  border-radius: 10px;
  background: #1B73E8;
  font-weight: 600;
  //font-size: 40px;
  color: #FFFFFF;
}
.desc{

}
</style>
