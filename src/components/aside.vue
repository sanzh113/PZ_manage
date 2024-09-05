<template>
    <el-menu
        :style="{width: !isCollapse?'230px':'60px'}"
        
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        text-color="#fff"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        :default-active="active"
      >
      <!-- 收缩之后的文字显示两个字 :style="{width: !isCollapse?'230px':'55px'}"-->
      <p class="logo-lg">{{isCollapse?'陪诊':'滴滴陪诊'}}</p>
      <!-- 放置左边导航栏  TreeMenu组件 用ele ui框架 -->
        <TreeMenu :index="1" :menuData="menuData" />
        <!-- 通过defineProps在子组件中 接受数据 -->
      </el-menu>
</template>

<script setup name="Aside">
import TreeMenu from './treeMenu.vue';
import {useRouter} from 'vue-router'
import { computed,reactive } from 'vue'
import { useStore } from 'vuex';

// 获得当前router的实例
const router = useRouter()
// 通过computed 中访问 state

// console.log(router);
// 创建响应式数据
// const menuData = reactive(router.options.routes[0].children) //这是写死的路由
// 这是动态路由
const menuData = computed(()=>store.state.menu.routerList)

const store = useStore()
const isCollapse = computed(()=>{
  // console.log('aside--',store.state.menu);
  // 要return
  return store.state.menu.isCollapse
})

const active = computed(()=> { return store.state.menu.menuActive})
console.log("==menuactive--",active);//这里是未定义


const handleOpen = () => {
//   console.log(key, keyPath)
}
const handleClose = () => {
//   console.log(key, keyPath)
}

</script>

<style lang="less" scoped>
.aside-container{
  // 自己改写ui组价的样式
  height: 100%;
  .logo-lg{
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color:#fff;
  }
}
</style>