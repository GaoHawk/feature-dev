<template>
   <div class="login">
     <Card>
         <p slot="title">
           <Icon type="log-in"></Icon>
           快速登录
        </p>
        <div>
          <Form ref="formInline" :model="formInline" :rules="ruleInline" class="custom-loginForm" >
              <FormItem prop="user">
                  <Input type="text" v-model="formInline.user" placeholder="Username" @keyup.native.enter="checkLogin('formInline')">
                      <Icon type="ios-person" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem prop="password">
                  <Input type="password" v-model="formInline.password" placeholder="Password" @keyup.native.enter="checkLogin('formInline')">
                      <Icon type="ios-locked" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem>
                  <Button type="primary" long @click="handleSubmit('formInline')">登陆</Button>
              </FormItem>
          </Form>
          <p class="login-tip">输入管理员账号和密码</p>
        </div>

     </Card>

  </div>
</template>
<style scoped>

  .custom-loginForm{
    /* margin: 0 auto; */
    /* width: 500px;
    height: 500px; */
    padding:10px 0 0 ;
  }
  .login .login-tip{
    font-size: 10px;
    text-align: center;
    color:#c3c3c3;
  }
  .login{
    position: absolute;
    right:160px;
    top: 50%;
    transform:translateY(-60%) ;
    -webkit-transform:translateY(-60%) ;

    width:300px;
  }
</style>

<script>
import { LOGIN } from '../serverApi'
import Bus from '../eventBus'
export default {
  data() {
    return {
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "请输入你的用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入你的密码.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码长度不应小于6",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    checkLogin(name){
      let vm = this;
      debugger
      this.$refs[name].validate(valid => {
        if(valid){
          vm.handleSubmit(name)
        }else{
          this.$Message.error("登录失败!");
        }
      })
    },
    handleSubmit(name) {
      let vm = this;
      let cookies = localStorage.cookies || '';
      console.log(LOGIN)
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$http({
            method:'post',
            headers: {'Authorization':'Bearer ' + cookies },
            url:LOGIN,
            data:{
              username:this.formInline.user,
              password:this.formInline.password
            }
          }).then(response =>{
            console.log(response)
            localStorage.cookies = response.data.data.token;
            let dateString = new Date().getTime();
            localStorage.dateString = dateString;
            // console.log(response.data.message)
            if(response.data.message == '成功'){
              vm.$store.commit('LOGIN',this.formInline.user);
              window.localStorage.username = this.formInline.user;
              vm.$store.commit('ROUT_PATH','/hello');
              Bus.$emit('getMenu',localStorage.cookies)
              console.log(vm.$store);
              this.$Message.success("Success!");
            }else{
              vm.$Notice.open({
                title:'操作反馈',
                desc: "登录失败, " + response.data.message,
                duration: 3,
                top: 50
              })
            }
          }).then(response =>{

          })
          .catch(function(err){
            console.log('catch',err)
          })
        } else {
          this.$Message.error("登录失败!");
        }
      });
    }
  }
};
</script>
