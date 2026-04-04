// 简单的 mock 认证服务
import { postRequest } from '../utils/api'

export default {
  loginUser(username, password){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(!username || !password) return reject(new Error('用户名或密码不能为空'))
        // 这里可以扩展为更严格的校验或调用真实后端
        resolve({ token: 'user-token-simulated', username })
      }, 600 + Math.random()*600)
    })
  },
  loginAdmin(loginFormPost){
    return postRequest('/login', loginFormPost).then(resp => {
        if (resp) {
          localStorage.setItem("user", JSON.stringify(resp.obj));
          return resp;
        }
        return Promise.reject(new Error('登录失败'));
    })
  }
  ,
  registerUser(username, password){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(!username || !password) return reject(new Error('用户名或密码不能为空'))
        try{
          const key = 'mock_users'
          const users = JSON.parse(localStorage.getItem(key) || '[]')
          if(users.find(u => u.username === username)){
            return reject(new Error('用户名已存在'))
          }
          users.push({ username, password })
          localStorage.setItem(key, JSON.stringify(users))
          resolve({ token: 'user-token-simulated', username })
        }catch(e){
          reject(e)
        }
      }, 600 + Math.random()*600)
    })
  }
}
