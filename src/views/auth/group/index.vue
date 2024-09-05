<template>
  <!-- 组件 -->
  <panel-head :route="route"/>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
  </div>
  

  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"  />
    <el-table-column prop="name" label="昵称"  />
    <el-table-column prop="permissionName" label="菜单权限" width="500px"/>
    <el-table-column  label="操作" >
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>

    </el-table-column>

  </el-table>
  <!-- 分页 右下角页码 页数 -->
   <div class="pagination-info">
      <el-pagination
            v-model:current-page="paginationData.pageNum"
            :page-size="paginationData.pageSize"
            :size="small"
            :background="false"
            layout="total, prev, pager, next"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />

   </div>
 

  <el-dialog 
  v-model="dialogFormVisible"  width="500"
  :before-close="beforeClose"
  title="添加权限"
  >
    <el-form ref="formRef"
    label-width="100px"
    label-position="left"
    :model="form"
    :rules="rules"
    >
     <el-form-item v-show="false" prop="id">
      <el-input v-model="form.id"></el-input>
    </el-form-item>

    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" placeholder="填写权限名称"></el-input>
    </el-form-item>
    <el-form-item label="权限" prop="permissions">
      <el-tree 
      ref="treeRef"
      :data="permissionData" 
      style="max-width: 600px;" 
      node-key="id" show-checkbox
      :default-checked-keys="defaultKeys"
      :default-expanded-keys="[2]"
      >
      <!-- :default-expanded-keys="[2]"默认展开 -->
      </el-tree>
    </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <!-- 点击提交时 触发校验 -->
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>


  </el-dialog>

</template>

<script setup>

import {reactive, ref,onMounted, nextTick} from'vue'
// 权限的菜单数据
import {userGetmenu,userSetmenu,menuList} from '../../../api'
// 图标库
import {Plus} from '@element-plus/icons-vue'

import { useRoute } from 'vue-router';

// 拿到当前的路由实例
const route = useRoute()


// 在挂载的时候获取权限菜单数据
onMounted(()=>{
  console.log('group mounted---------------');
  userGetmenu().then(({data})=>{
    console.log('菜单数据',data);
    permissionData.value = data.data
  })
  // 调用请求列表
  getListData()
})

// 列表数据
const tableData = reactive({
  list:[],
  total:0
})


// 打开弹窗
const open = (rowData={})=>{
  dialogFormVisible.value = true
  //弹窗打开form生成式异步的
  nextTick(()=>{
    if(rowData){
      Object.assign(form,{id: rowData.id, name: rowData.name})
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}


const  paginationData = reactive({
  pageNum:'1',
  pageSize:'10'
})
// 拿到点击页码跳转
const handleSizeChange = (val)=>{
  paginationData.pageSize = val
  getListData()
}
const handleCurrentChange = ()=>{
  paginationData.pageNum = val 
  getListData()
}


// 请求列表数据会复用 在新增查询的时候 都会请求列表数据
const getListData = ()=>{
  menuList(paginationData).then(({data})=>{
    // 获得数据后给listdata好显示
    const {list,total} = data.data
    tableData.list = list
    tableData.total = total
  })
}



// form的数据
const form = reactive({
  id:'',
  name: '',
  permissions: '',
})

// 权限树形结构菜单数据
const permissionData = ref([])


// 弹窗的显示隐藏
const dialogFormVisible = ref(false)
// 关闭弹窗的回调
const beforeClose = ()=>{
  dialogFormVisible.value = false
  // 重置表单的数据 不然会有数据回显的问题 打开新增会出现之前编辑的信息
  formRef.value.resetFields()
  // 勾选重置
  treeRef.value.getCheckedKeys(defaultKeys)
}

// 选中权限 默认选中的是索引4 5
const defaultKeys = [4,5]

// 拿到treeRef实例
const treeRef = ref()
const formRef = ref()

// 表单校验
const rules = reactive({
  name:[{ required: true, trigger: 'blur' ,message:'请输入权限名称'}],
})



// 表单提交校验
const confirm = async (formEl)=>{
  if (!formEl) return
// 手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 通过校验
      // 获得当前选中checkbox的权限
    const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetmenu({name: form.name,permissions,id:form.id}).then(({data})=>{
        console.log(data);
        // 添加完成后关闭弹窗
        beforeClose()
        // 请求列表数据 刷新增加后的数据 并显示
        getListData()
      })
    }else{
      console.log('error submit!', fields)
    }
  })
}

</script>

<style>
.btns{
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>