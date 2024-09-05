// 定义store 
import { createStore } from 'vuex'
import menu from './menu'
import createPersistedstate from 'vuex-persistedstate'
// 创建store 定义模块 每个模块有自己的satate mutation
// 对外进行暴露 需要挂载到vue实例上
// 创建Store实例
export default createStore({
    //createPersistedstate()为了实现持久化，key的属性值是缓存的名称
    plugins: [new createPersistedstate({
        key: 'pz_v3pz'
    })],
    modules: {
        // 每个模块有自己的statte mutation
        menu
    }
})