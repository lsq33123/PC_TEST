<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapMutations } from 'vuex';
import { getToken } from '@/request/api';// 导入我们的api接口
export default {
  data () {
    return {
      logining: false,
      ruleForm2: {
        account: '000lsq',
        checkPass: '1'
      },
      userToken:"",
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      checked: true
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    handleReset2 () {
      this.$refs.ruleForm2.resetFields()
    },
    handleSubmit2 (ev) {
        let _this = this;
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.logining = true
          var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass }
        //   requestLogin(loginParams).then(data => {
        //     this.logining = false
        //     let { msg, code, user } = data
        //     if (code !== 200) {
        //       this.$message({
        //         message: msg,
        //         type: 'error'
        //       })
        //     } else {
        //       sessionStorage.setItem('user', JSON.stringify(user))
        //       this.$router.push({ path: '/table' })
        //     }
        //   })
        var params={
            "loginName":this.ruleForm2.account,
            "password":this.ruleForm2.checkPass,
            "platform":"38",
            "clientId":"5907a7aa-e98b-41d0-bb51-cdeba086a995",
            "clientSecret":"067edd58-47ca-4922-ac9e-6dc700e18a8b"
        };
        // this.axios({
        //     method:"post",
        //     url:"http://tapi.hszb.harsons.cn/service/login",
        //     data:params
        // }).then(res =>{console.log(res.data);
        //     _this.userToken = 'Bearer ' + res.data.data.body.token;
        //   // 将用户token保存到vuex中
        //   _this.changeLogin({ Authorization: _this.userToken });
        //   _this.$router.push('/home');
        //   alert('登陆成功');
        // }).catch(err =>{
        //     alert("密码错误！");
        //     console.log(err);
        // });

        getToken(params).then(res =>{
            //console.log(res.data);
            if(res.status == 'success'){
                _this.userToken = res.data;
                //_this.userToken = 'admin ' + res.data;
            }
          // 将用户token保存到vuex中
          //_this.changeLogin({ Authorization:_this.userToken },{ Authorization:_this.userToken });

                localStorage.setItem('token',res.data)
                // 将登录名使用vuex传递到Home页面
                this.$store.commit('handleUserName',_this.ruleForm2.account);
          _this.$router.push('/home');
            this.$message({
                message: '登录成功',
                type: 'success'
            });
        }).catch(err =>{
            this.$message({
                message: '密码错误！',
                type: 'warning'
            });
            _this.logining = false
            console.log(err);
        });
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }

    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
