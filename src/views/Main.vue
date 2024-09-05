<template>
 
  <div class="common-layout">
    <el-container>
      <!-- <el-aside width="200px">Aside</el-aside> -->
       <!--左边导航 -->
       <Aside />
      <el-container>
        <!-- header的组件 -->
        <el-header><Header /></el-header> 
        
        <el-main>
          <!-- 放上路由显示 -->
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script setup>
import { RouterView } from 'vue-router';
import Aside from '../components/aside.vue';
import Header from '../components/navHeader.vue';

</script>

<style lang="less" scoped>
.common-layout{
  display: flex;
  height: 100%;
  .el-container{
    height: 100%;
  }
}
</style>