import request from '../utils/request'

// 发送验证码
export const getCode = (data) => {
    //发送post请求
    return request.post('/get/code', data)
}
// 注册用户
export const UserAuthentication = (data) => {
    return request.post('/user/authentication', data)

}
// 登录
export const login = (data) => {
    return request.post('/login', data)
}
// 权限管理
export const authAdmin = (params) => {
    return request.get('/auth/admin', { params })
}
// 菜单权限数据
export const userGetmenu = () => {
    return request.get('/user/getmenu')
}
// 菜单权限修改
export const userSetmenu = (data) => {
    return request.post('/user/setmenu', data)
}
// 菜单权限列表
export const menuList = (params) => {
    return request.get('/menu/list', { params })
}
// 权限下拉列表
export const menuSelectlist = () => {
    return request.get('/menu/selectlist')
}

// 用户信息修改
export const updateUser = (data) => {
    return request.post('/update/user', data)
}
// 用户菜单权限
export const menuPermissions = () => {
    return request.get('/menu/permissions')
}
// 培护士头像列表
export const photoList = () => {
    return request.get('/photo/list')
}
// 培护士创建
export const companion = (data) => {
    return request.post('/companion', data)
    // 
}
// 培护列表
export const companionList = (params) => {
    return request.get('/companion/list', { params })
}
// 培护士删除
export const deleteCompanion = (data) => {
    return request.post('/delete/companion', data)
    // 
}
// 订单列表 订单管理
export const adminOrder = (params) => {
    return request.get('/admin/order', { params })
}

export const updateOrder = (data) => {
    return request.post('/update/order', data)
    // 
}