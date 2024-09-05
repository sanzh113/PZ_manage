const localData = localStorage.getItem('pz_v3pz')
// 如果保存的持久化pz_v3pz存在 就从本地存储读取
const state = localData ? localData.menu : {
    // 展开状态
    isCollapse: false,
    // 展开的菜单
    selectMenu: [],
    routerList: [],
    menuActive: '1-1'
}

const mutations = {
    collapaseMenu(state) {
        // console.log('@@');

        state.isCollapse = !state.isCollapse
        // console.log(state.isCollapse);
    },
    // 在顶部添加对应点击的菜单
    addMenu(state, payload) {
        // payload 对数据进行去重 防止顶部菜单多次点击生成多个相同的菜单 findInde找不到相同的就返回-1
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state, payload) {
        // 找到点击数据的索引
        const index = state.selectMenu.findIndex(val => val.name === payload.name)
        // t通过索引删除数组指定元素 index起始位置 删除的个数
        state.selectMenu.splice(index, 1)

    },
    dynamicMenu(state, payload) {
        console.log(payload);
        // 通过glob导入文件
        // 获得的是每个views下面的路径==路由
        // 导入view文件下的文件下的文件中的所有后缀为vue的
        const moudules = import.meta.glob('../views/**/**/*.vue')
        console.log('moudules:', moudules);
        function routerSet(router) {
            router.forEach(route => {
                // 如果当前路由下没有孩子 拼接路由路径 
                // 把compoenet对应的路径（path: '/auth/admin'）转换成vue文件
                if (!route.children) {
                    const url = `../views${route.meta.path}/index.vue`
                    // 拿到获取的vue组件
                    route.component = moudules[url]
                } else {
                    // 有子菜单就要递归
                    routerSet(route.children)
                }
            });
        }
        // 拿到完整的路由数据
        routerSet(payload)
        state.routerList = payload

    },
    updateMenuActive(state, payload) {

        state.MenuActive = payload
        // console.log('payload:===', payload);
        // console.log('state.MenuActive:===', state.MenuActive);
    }


}

export default {
    state,
    mutations
}