import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 导入配置的路由文件 
import router from './router'
import store from './store'
import PanelHead from './components/panelHead.vue'
// ele UI的icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// 刷新后的动态路由添加
const localData = localStorage.getItem('pz_v3pz')
if (localData) {
    store.commit('dynamicMenu', JSON.parse(localData).menu.routerList)
    store.state.menu.routerList.forEach(item => {
        router.addRoute('main', item)
    })
}

//路由守卫
router.beforeEach((to, from) => {
    const token = localStorage.getItem('pz_token')
    console.log('to.path', to.path)
    console.log('token', token)

    // 不是登录页面时 token不存在 会直接跳转到登录页面
    if (!token && to.path !== '/login') {
        // console.log('第1种情况登录');
        return '/login'
    } else if (token && to.path === '/login') {
        // token存在且还在访问登录界面 不允许
        // console.log('第2种情况登录');
        return '/'
    } else {
        // console.log('第三种情况登录');
        return true

    }
})




const app = createApp(App)
// 图标iicon全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 全局注入组件
app.component('PanelHead', PanelHead)

// 路由挂载在vue实例上
app.use(router)
// vuex的store 挂载
app.use(store)
app.mount('#app')
// 入口文件

// main.ts


