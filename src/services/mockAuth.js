// 简单的 mock 认证服务
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
  loginAdmin(username, password){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(!username || !password) return reject(new Error('账号或密码不能为空'))
        // 示例：仅当账号为 admin 且密码为 admin 时通过
        if(username === 'admin' && password === 'admin'){
          resolve({ token: 'admin-token-simulated', username })
        }else{
          reject(new Error('无效的管理员凭证（示例：admin / admin）'))
        }
      }, 600 + Math.random()*600)
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
