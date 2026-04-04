<template>
  <div class="login-root">
    <div class="card">
      <h2>注册账户</h2>
      <div class="field">
        <label>用户名</label>
        <input v-model="username" placeholder="请输入用户名" />
      </div>
      <div class="field">
        <label>密码</label>
        <input type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <div class="field">
        <label>确认密码</label>
        <input type="password" v-model="confirm" placeholder="请再次输入密码" />
      </div>
      <div class="actions">
        <button class="primary" :disabled="loading" @click="register">{{ loading ? '注册中...' : '注册' }}</button>
        <router-link to="/login" class="link">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import loginAuth from '../../api/loginAuth'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)

async function register(){
  if(!username.value || !password.value){
    ElMessage.error('请输入用户名和密码')
    return
  }
  if(password.value !== confirm.value){
    ElMessage.error('两次输入的密码不一致')
    return
  }
  loading.value = true
  try{
    const user = {username: username.value, password: password.value}
    await loginAuth.registerUser(user)
    ElMessage.success('注册成功，请登录')
    router.push({ path: '/login'})
  }catch(e){
    return
  }finally{
    loading.value = false
  }
}
</script>

<style scoped>
.login-root{display:flex;align-items:center;justify-content:center;height:100%;width: 100%;padding:32px;background:linear-gradient(180deg,#f0f7ff 0%, #fbfbff 100%)}
.card{width:420px;max-width:92vw;padding:28px;border-radius:14px;background:rgba(255,255,255,0.98);box-shadow:0 10px 30px rgba(2,6,23,0.08);border:1px solid rgba(15,23,36,0.04);transition:transform .18s ease,box-shadow .18s ease}
.card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(2,6,23,0.12)}
.card h2{margin:0 0 16px;color:#0f1724}
.field{display:flex;flex-direction:column;margin:10px 0}
.field label{font-size:13px;color:#475569;margin-bottom:8px}
.field input{padding:12px;border-radius:10px;border:1px solid #e6eef6;background:#fbfdff;outline:none;transition:border-color .12s ease,box-shadow .12s ease}
.field input:focus{border-color:#60a5fa;box-shadow:0 6px 18px rgba(59,130,246,0.08)}
.actions{display:flex;align-items:center;gap:12px;margin-top:18px}
.primary{flex:1;background:linear-gradient(90deg,#06b6d4,#3b82f6);color:#fff;border:none;padding:10px 14px;border-radius:10px;font-weight:600;cursor:pointer}
.primary:hover{filter:brightness(0.98)}
.primary[disabled]{opacity:0.7;pointer-events:none}
.link{color:#3b82f6;text-decoration:none;font-size:14px}
</style>
