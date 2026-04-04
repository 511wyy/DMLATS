import { postRequest } from '../utils/api'
import { setUser } from '../stores/store'

export default {
  login(loginFormPost){
    return postRequest('/login', loginFormPost).then(resp => {
        if (resp) {
          localStorage.setItem("user", JSON.stringify(resp.obj));
          try{ setUser(resp.obj) }catch(e){ console.warn('setUser failed', e) }
          return resp;
        }
        return Promise.reject(new Error('登录失败'));
    })
  }
  ,
  registerUser(user){
    return postRequest('/register', user).then(resp => {
        if (resp) {
          return resp;
        }
        return Promise.reject(new Error('注册失败'));
    })
  }
}
