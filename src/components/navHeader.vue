<template>
  <div class="header-container">
   <!-- 点击左边收缩小图标 实现左边导航栏的收缩折叠 通过commit触发相应的函数-->
    <div class="header-left flex-box">
        <el-icon class="icon" size="20"  @click="store.commit('collapaseMenu')"><Fold /></el-icon>
        <ul class="flex-box">
            <li v-for="(item,index) in selectMenu" 
            :key="item.path" 
            :class="{selected:route.path === item.path}"
            class="tab flex-box"
            >
                <el-icon  size="12">
                    <component :is="item.icon"></component></el-icon>
                    <!-- 点击顶部菜单跳转 -->
                    <router-link class="text flex-box" :to="{path:item.path}">
                        {{ item.name }}
                    </router-link>
                    
                    <!-- 关闭的图标 @click="closeTab(item,index)"-->
                <el-icon  size="12" class="close"  @click="closeTab(item,index)"><Close /></el-icon>
            </li>
        </ul>
    </div>

    <div class="header-right">
       <!-- 下拉菜单 -->
        <el-dropdown @command="handleClick">
            <div class="el-dropdown-link flex-box">
                <!-- 用户头像 -->
                <el-avatar
            :src="userInfo.avatar"
        />
           <p class="user-name">{{ userInfo.name }}</p>
            </div>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="cancel">退出</el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                
            </el-dropdown-menu>
            </template>
        </el-dropdown>

    </div>
    </div>
</template>

<script setup>
// 
import {useStore} from 'vuex'
import { computed } from 'vue';
import {useRoute,useRouter} from 'vue-router'
// 拿到store实例
const store = useStore()
const selectMenu = computed(()=>store.state.menu.selectMenu)
// console.log('selectMenu',selectMenu);

// 根据本地存储更新用户名
const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))

// 拿到当个路由的路径
const route = useRoute()
const router = useRouter()
console.log('route',route);
// 点击关闭tag
const closeTab = (item,index)=>{
    // console.log('--------------------------222-------------------');
    
    // 删除的当前这个tag
    store.commit('closeMenu',item)
    // 删除的是非当前页tag 通过当前路由的path和选中的tab的path对比
    if(route.path !== item.path){
        // 不做处理
        return 
    }
    // 这时候的selectMenu.value是删除点击的这个后剩余的数据
    const selectMenuData = selectMenu.value
    // 删除的是当前项
    if(index === selectMenuData.length){
        // 删除的最后一项 
        if(!selectMenuData.length){
            //如果只剩最后一个就清空了 那需要返回根目录
            router.push('/')
        }else{
            router.push({
                // 如果不是最后一个 那删除当前这个后 需要呈现前一个数据，路由路径换成前一个
                path:selectMenuData[index-1].path
            })
        }
    }else{
        // 如果删除的是中间位置 tag需要呈现被删除的后一个数据
        router.push({
                // 如果不是最后一个 那删除当前这个后 需要呈现前一个数据，路由路径换成前一个
                path:selectMenuData[index].path
            })

    }


}


const handleClick = (command)=>{
    if(command === 'cancel'){
        // 点击退出 就清除本地存储
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('pz_v3pz')
        window.location.href = window.location.origin
    }
}

</script>

<style lang="less" scoped>
.flex-box{
    // 一行显示
    display: flex;
    align-items: center;
    height: 100%;
}


.header-container{
    display: flex;
    /* 水平 左右 上下居中 */
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left{
        height: 100%;
        .icon{
            width: 45px;
            height: 100%;
        }
        .icon:hover{
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab{
            padding: 0 10px;
            height: 100%;
            .text{
                margin:0 5px
            }
            .close{
                visibility:hidden ;
            }
        }
        .tab:hover {
            background-color:#f5f5f5 ;
            .close{
                visibility:inherit ;
                cursor: pointer;
                color:black
            }
         }
        //  &select与tab同级
         & .selected{
            a{
                color:#409eff;
            }
            i{
                color:#409eff;
            }
            background-color: #f5f5f5;
         }
    }
    .header-right{
        .user-name{
            margin-left:10px
        }
    }
    a{
        height: 100%;
        color:#333;
        font-size: 15px;
    }


}
</style>