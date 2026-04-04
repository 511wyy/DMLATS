import axios from 'axios'
import {ElMessage} from 'element-plus';
import router from '../router'

axios.interceptors.response.use(success => {  //
    if (success.status && success.status == 200 && success.data.status == 500) {
        if (success.data.msg === '该数据有关联数据，操作失败!')
            return
        else
            ElMessage.error({message: success.data.msg})
        return;
    }
    if (success.data.msg) {
        // Message.success({message: success.data.msg})
    }
    return success.data;
}, error => { //
    if (!error.response) {
        ElMessage.error({message: '网络异常或无法连接到服务器'})
        return Promise.reject(error)
    }
    if (error.response.status == 504 || error.response.status == 404) {
        ElMessage.error({message: '服务器被吃了( ╯□╰ )'})
    } else if (error.response.status == 403) {
        ElMessage.error({message: '权限不足，请联系管理员'})
    } else if (error.response.status == 401) {
        ElMessage.error({message: error.response.data.msg ? error.response.data.msg : '尚未登录，请登录'})
        router.replace('/');
    } else {
        if (error.response.data.msg) {
            ElMessage.error({message: error.response.data.msg})
        } else {
            ElMessage.error({message: '未知错误!'})
        }
    }
    return Promise.reject(error)
})

let base = 'http://localhost:8081';

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        //contentType:"applicaiton/json",
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''
        }
    })
}

export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        headers: {
            'token': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''
        }
    })
}
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers:{
            'token': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''
        }
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params,
        headers:{
            'token': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''
        }
    })
}
