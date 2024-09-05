<template>
   <!-- 组件 -->
  <panel-head :route="route"/>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"  />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别">
      <!-- 通过插槽拿到id -->
      <template #default="scope">
          {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"/>
    <!-- 状态 -->
    <el-table-column prop="active" label="状态" >
      <!-- 通过插槽拿到id -->
      <template #default="scope">
          <el-tag :type="scope.row.active? 'success': 'danger'">{{scope.row.active? '正常': '失效'}}</el-tag>
      </template>
    </el-table-column>
    <!-- 创建时间 把时间戳改成时间格式 -->
    <el-table-column  label="创建时间">
      <!-- 通过插槽拿到id -->
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>

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

    <el-form-item label="手机号" prop="mobile" >
      <el-input v-model="form.mobile" disabled></el-input>
    </el-form-item>
    <el-form-item label="昵称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="菜单权限" prop="permissions_id">
      <el-select 
      v-model="form.permissions_id"
      placeholder="选择菜单权限"
      style="width: 240px;"
      >
      <el-option v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      />

      
      </el-select>
      
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
// 当用户访问其他页面时 token失效
import {authAdmin,menuSelectlist,updateUser} from '../../../api'
import { ref,reactive,onMounted } from 'vue';
import dayjs from 'dayjs';
import { fa, it } from 'element-plus/es/locale/index.mjs';
import { useRoute } from 'vue-router';

// 拿到当前的路由实例
const route = useRoute()
console.log('admin-route',route);


// 列表数据
const tableData = reactive({
  list:[],
  total:0
})


onMounted(() => {
    console.log('---index mounted!---');
    // 发送请求 获得数据
    getListData()
  // 获取当前下拉列表
    menuSelectlist().then(({data})=>{
      console.log('menuSelectlist:',data);
      
      options.value = data.data
    })
})
// 请求列表
const getListData = ()=>{
  // 发送请求
      authAdmin(paginationData).then(({data})=>{  
        const {list,total} = data.data
        list.forEach(item => {
          // 把时间戳变成年月日
          item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        });
        // console.log('authAdmin',data);
        tableData.list = list
        tableData.total = total
  })
}



// 拿到点击页码跳转
const handleSizeChange = (val)=>{
  paginationData.pageSize = val
  getListData()
}
const handleCurrentChange = ()=>{
  paginationData.pageNum = val 
  getListData()
}

// 点击编辑弹出的窗口
const dialogFormVisible = ref(false)
const beforeClose = ()=>{
  dialogFormVisible.value = false
}
// 编辑表单
const form = reactive({
  name:'',
  permissions_id:''
})

const formRef = ref()

// 表单提交校验
const confirm = async (formEl)=>{
  if (!formEl) return
// 手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      const {name,permissions_id} = form
      // 把当前获得的name,permissions_id发送修改用户信息的请求
      updateUser({name,permissions_id}).then(({data})=>{
        if(data.code === 10000){
          // 修改成功关闭窗口
          dialogFormVisible.value = false
          // 重新获得更新后的列表数据
          getListData()
        }
      })
    }else{
      console.log('error submit!', fields)
    }
  })
}

const  paginationData = reactive({
  pageNum:'1',
  pageSize:'10'
})



const options = ref([])
// 根据权限id匹配权限名称
const permissionName = (id)=>{
  // 遍历optin数据里面的id 找到相同的id 获得他的权限name
  const data = options.value.find(el=> el.id === id)
  return data ? data.name :'dd'
}

// 表单校验
const rules = reactive({
  name:[{ required: true, trigger: 'blur' ,message:'请输入昵称'}],
  permissions_id:[{ required: true, trigger: 'blur' ,message:'请选择菜单选项'}],
})

// 打开弹窗
const open = (rowData={})=>{
  dialogFormVisible.value = true
    if(rowData){
      Object.assign(form,{mobile:rowData.mobile,name: rowData.name, permissions_id: rowData.permissions_id})
    }
  }


</script>

<style lang="less">
.flex-box{
  display: flex;
  justify-content: left;
}
</style>