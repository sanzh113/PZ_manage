<template>
    <!-- <div> -->
      
        <!-- 没有子菜单的形式  -->
        <template v-for="item in props.menuData">
        <!-- 要判断是不是有子菜单 有子菜单的有children  没有子菜单的child长度为0 key要唯一 就是父亲的index+当前子的index  -->
          <el-menu-item 
          @click="handleClick(item,`${props.index}-${item.meta.id}`)"
          v-if="!item.children || item.children.length == 0"
           :index="`${props.index}-${item.meta.id}`"
           :key="`${props.index}-${item.meta.id}`">
            <!-- <el-icon><setting /></el-icon>
            <span>Navigator Four</span> -->
            <el-icon size="20">
              <!-- 动态组件 通过component渲染 -->
               <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{item.meta.name}}</span>
          </el-menu-item>
      
        <!-- 有子菜单的情况 -->
        <el-sub-menu  v-else  :index="`${props.index}-${item.meta.id}`">
          <template #title>
            <el-icon size="20">
              <!-- 动态组件 通过component渲染 -->
               <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{item.meta.name}}</span>
          </template>

         <!-- 递归调用自己 -->
            <!-- <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item> -->

          <tree-menu :index="`${props.index}-${item.meta.id}`" 
          :menuData="item.children" />
         

                      
          </el-sub-menu>   
        </template>
    
    <!-- </div> -->
</template>

<script setup>
import { useStore } from 'vuex';

// 获取saide传递的数据 用defieprops接受
const props = defineProps(['menuData','index'])
console.log('props',props);

import {useRouter} from 'vue-router'
// 获得当前router的实例
const router = useRouter()

const store = useStore()

// 点击时跳转路由 点击菜单
const handleClick = (item,active)=>{
  console.log('item',item);
  store.commit('addMenu',item.meta)
  // 点击后要改变高亮指示,刷新后 还是最后一次高亮的位置
  // console.log('tree active',active);
  store.commit('updateMenuActive',active)
  router.push(item.meta.path)
  

  
}
</script>

<style scoped>

</style>