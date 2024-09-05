<template>
    <el-row class="login-container" justify="center" :align="middle">
        
        <el-card style="max-width: 480px">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl"/> 
                </div>                
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{formType?'返回登录':'注册账号'}}</el-link>
            </div>
            <!-- 表单收集数据 ref="loginFormRef"获得表单整个dom-->
            <el-form 
            ref="loginFormRef"
            :model="loginForm" 
            style="max-width: 600px;"
            class="demo-ruleForm"
            :rules="rules"
            >
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled"/>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="Lock"/>
                </el-form-item>
                <!-- 如果是登录的话 不需要验证码 注册才需要-->
                <el-form-item v-if="formType"  prop="validCode">
                    <el-input v-model="loginForm.validCode"  placeholder="验证码" :prefix-icon="Lock">
                        <template #append>
                            <span @click="countdownChange">{{countdown.validText}}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- 提交按钮 -->
                <el-form-item>
                    <!-- 点击函数 传递loginFormRef实例 -->
                    <el-button type="primary" :style="{width:'100%'}" @click="submitForm(loginFormRef)">{{formType?'注册账号':'登录'}}</el-button>
                </el-form-item>


            </el-form>
        </el-card>
    </el-row>  
</template>

<script setup>
import {ref,reactive,computed,toRaw} from 'vue'
import {getCode,UserAuthentication,login,menuPermissions} from '../../api'
import { ElMessage } from 'element-plus';
import {UserFilled,Lock} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href




// 表单数据 用对象装
const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: ''
})

// 0登录 1注册
const formType = ref(0)
// 点击切换登录和注册
const handleChange = ()=>{
    formType.value = formType.value ? 0 : 1
}

// 发送短信
const countdown = reactive({
    validText:'获取验证码',
    time:10
})

// 只能创建一个定时器 不然多个重复 设置flag
let flag = false
const countdownChange = ()=>{
    // 如果定时器已经存在 已发送不处理 直接return
    if(flag) return 
    // 判断手机号是否正确
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    // 如果手机号不存在 或者格式不对
    if(!loginForm.userName || !phoneReg.test(loginForm.userName)){
        return ElMessage({message: '请检查手机号是否正确',type: 'warning',})
    }
    
    const timer = setInterval(()=>{
        if(countdown.time <=0 ){
            // 倒计时结束
            countdown.time = 10
            countdown.validText = '获取验证码'
            flag = false
            clearInterval(timer)
        }else{
            countdown.time -= 1
            countdown.validText = `剩余${countdown.time}`
        }
        
    },1000)
    flag = true
    getCode({tel:loginForm.userName}).then((data)=>{
        // console.log('data',data);
        if(data.code === 10000){
            ElMessage.success('发送成功')
        }
        
    })

}
// 账号校验规则 rule当前规则,value获得当前表单该元素的值,callback
const validateUser = (rule,value,callback)=>{
    if(value === ''){
        callback(new Error('请输入账号'))
    }else{
        // 如果有手机号 会进行正则匹配
        const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        phoneReg.test(value) ? callback() : callback(new Error('手机号格式错误，请输入正确手机号'))
    }
}

// 密码校验
const validatePass = (rule,value,callback)=>{
     if(value === ''){
        callback(new Error('请输入密码'))
    }else{
        const phoneReg = /^[a-zA-Z0-9_-]{4,16}$/
        phoneReg.test(value) ? callback() : callback(new Error('密码格式错误，需要4-16位字符'))
    }
}

// 表单校验
const rules = reactive({
    // 在失去焦点的时候触发
    userName:[{ validator: validateUser, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }],  
})

const store = useStore()
const loginFormRef = ref()
const router = useRouter()

const routerList = computed(()=>store.state.menu.routerList)

// 表单提交 async异步校验
const submitForm = async (formEl)=>{
  if (!formEl) return
// 手动触发校验

  await formEl.validate((valid, fields) => {
    if (valid) {
        // loginForm用户名 密码 状态码
      console.log(loginForm,'submit!')
    //   判断当前是注册1还是登录0
        if(formType.value){
            UserAuthentication(loginForm).then(({data})=>{
                if(data.code === 10000){
                    console.log('注册成功,请登录');
                    ElMessage.success('注册成功,请登录')
                    // 舔砖到登录
                    formType.value = 0
                }
            })
        }else{
            // 登录页面
            login(loginForm).then(({data})=>{
                if(data.code === 10000){
                    console.log('登录成功');
                    ElMessage.success('登录成功')
                    // 页面跳转 token信息缓存
                    console.log('login',data);
                    localStorage.setItem('pz_token',data.data.token)
                    localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
                    menuPermissions().then(({data})=>{
                        // 调用store里面的动态菜单函数将component的路径变成完整vue文件路径
                        store.commit('dynamicMenu',data.data)
                        //更新之后动态的路由信息 通过computed获取到state里的数据
                        console.log('routerList',routerList);
                        // toRaw把响应式的数据变成普通的对象数据 只需要保存main 原始第一个路由路径 后面的都根据下面动态添加
                        toRaw(routerList.value).forEach(item => {
                            // 添加动态路由
                            router.addRoute('main',item)
                        });
                        // 登录成功跳转到首页
                         router.push('/')
                        
                    })
                    
                    
                }
            })
        }
    } else {
      console.log('error submit!', fields)
    }
  })

}

</script>

<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 50%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 430px;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }
</style>