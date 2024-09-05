<template>
   <!-- 组件 -->
  <panel-head :route="route"/>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
    <!-- 删除按钮 -->
     <el-popconfirm
    confirm-button-text="是"
    cancel-button-text="否"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="是否确认删除?"
    @confirm="confirmEvent"
  >
    <template #reference>
      <el-button :icon="Delete" type="danger" size="small">删除</el-button>
    </template>
  </el-popconfirm>
  </div>

  <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id"  />
    <el-table-column prop="name" label="昵称" />
    <el-table-column label="头像">
      <template #default="scope">
        <el-image style="width: 50px;height: 50px;"
        :src="scope.row.avatar"/>
      </template>
    </el-table-column>  
    <el-table-column prop="name" label="性别">
      <template #default="scope">
        {{ scope.row.sex ==='1'?'男':'女'}}
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
  title="陪护师添加"
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
    <el-form-item label="昵称" prop="name">
      <el-input v-model="form.name" placeholder="填写陪诊师昵称"></el-input>
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <!-- 头像不存在 就显示按钮 存在显示图片 -->
      <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisible=true">点击上传</el-button>
      <el-image v-else :src="form.avatar" style="width: 100px;height: 100px;"></el-image>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="form.sex" placeholder="请选择性别">
        <el-option  label="男" value="1" />
        <el-option  label="女" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <!-- 年龄数字选择器 -->
       <el-input-number v-model="form.age" :min="18" :max="50" @change="handleChange" />
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item label="是否生效" prop="active">
      <el-radio-group v-model="form.active">
        <el-radio :value="0">失效</el-radio>
        <el-radio :value="1">生效</el-radio>
    </el-radio-group>
    </el-form-item>
  </el-form>

  <template #footer>
    <div class="dialog-footer">
        <!-- 点击提交时 触发校验 -->
      <el-button type="primary" @click="confirm(formRef)">确认</el-button>
    </div>
  </template>
  </el-dialog>

  <!-- 上传头像的弹窗 -->
  <el-dialog 
  v-model="dialogImgVisible"  width="680"
  :before-close="beforeClose"
  title="选择头像"
  >
  <!-- 图片列表 -->
  <div class="image-list">
    <!-- 点击选中图片左上角有绿色勾 -->
    <div v-for="(item,index) in fileList" :key="item.name" @click="selectIndex = index" class="img-box">
      <div v-if="selectIndex === index" class="select">
        <el-icon color="#fff"><Check /></el-icon>
      </div>
      <el-image style="width: 148px;height: 148px;"
      :src="item.url"
      ></el-image>
    </div>
  </div>
  <template #footer>
      <div class="dialog-footer">
        <el-button  @click="dialogImgVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmImage()">确认</el-button>
      </div>
    </template>
  
  </el-dialog>
</template>

<script setup>
import {ref,reactive, onMounted,nextTick} from 'vue'
import {photoList,companion,companionList,deleteCompanion} from '../../../api'
// 图标库
import {Plus,InfoFilled,Delete} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
// 拿到当前的路由实例
const route = useRoute()


onMounted(()=>{
  photoList().then(({data})=>{
    fileList.value = data.data
    // console.log('staff 头像')
  })
  // 取得现在有的培护士 以列表的形式展示
  getListData()
})


const  paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})
// 列表数据
const tableData = reactive({
  list:[],
  total:0
})

const getListData = ()=>{
  // 发送请求
  companionList(paginationData).then(({data})=>{
    const {list,total} = data.data
    list.forEach(item => {
          // 把时间戳变成年月日
          item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        });    
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



// 弹窗的显示隐藏
const dialogFormVisible = ref(false)
const dialogImgVisible = ref(false)
const fileList = ref([])
// 选中的图片
const selectIndex = ref(0)

// 确认头像
const confirmImage = ()=>{
  // 通过选择的图片索引 在图片列表中获得选择的图片的url 再把url给表单作为最后选择的头像
  form.avatar = fileList.value[selectIndex.value].url
  // 再关闭弹窗
  dialogImgVisible.value = false  

}



// 关闭弹窗的回调
const beforeClose = ()=>{
  dialogFormVisible.value = false
  // 重置表单的数据
  formRef.value.resetFields()
  // 勾选重置
 
}

const formRef = ref()
// form的数据
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: ""
})

// 打开弹窗
const open = (rowData={})=>{
  dialogFormVisible.value = true
  //弹窗打开form生成式异步的
  nextTick(()=>{
    if(rowData){
      // 如果是编辑
      Object.assign(form,rowData)
      
    }
  })
}



// 表单校验
const rules = reactive({
  name:[{ required: true, trigger: 'blur' ,message:'请输入名称'}],
  avatar:[{ required: true,message:'请选择头像'}],
  sex:[{ required: true, trigger: 'blur' ,message:'请选择性别'}],
  mobile:[{ required: true, trigger: 'blur' ,message:'填写手机号'}]
})


// 表单提交
const confirm = async (formEl)=>{
  if (!formEl) return
// 手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 通过校验 则调用培护士创建借口 发送培护士的信息数据
      companion(form).then(({data})=>{
        if(data.code === 10000 ){
          ElMessage.success('成功')
          // 关闭弹窗
          beforeClose()
          // 更新列表 显示更新后的数据
          getListData()
        }else{
          ElMessage.error(data.message)
        }
      })
      
    }else{
      console.log('error submit!', fields)
    }

  })
}

// 存储勾选的数据
const  selectTableData = ref([])

const handleSelectionChange = (val)=>{
  // 只得到id就能删除
  selectTableData.value = val.map(item=>({id:item.id}))
}
const confirmEvent = ()=>{
  // 如果当前选择的数据为0 就不能删除
  if(!selectTableData.value.length){
    return ElMessage.warning('请至少选择一项数据')
  }
  deleteCompanion({id:selectTableData.value}).then(({data})=>{
    if(data.code === 10000){
      // 删除成功 更新删除后的列表 并显示
      getListData()
    }
  })
}


</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>