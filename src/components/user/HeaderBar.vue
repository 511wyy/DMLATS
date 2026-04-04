<template>
  <header class="header-bar">
    <div class="brand">DMLATS-达梦SQL自动优化框架</div>
    <div class="right">
      <template v-if="username">
        <span class="user-label">欢迎，{{ username }}</span>
        <button class="ghost" @click="logout">退出</button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { clearUser } from '../../stores/store'
import store from '../../stores/store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const user = computed(() => store.user)
const username = computed(() => user.value ? (user.value.username || user.value.name || '') : '')
const role = computed(() => {
  try{
    const r = user.value ? (user.value.role || '') : ''
    return typeof r === 'string' ? r.trim().toLowerCase() : ''
  }catch(e){ return '' }
})


function logout(){
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const currentRole = role.value
    try{ localStorage.clear() }catch(e){ console.warn('localStorage.clear failed', e) }
    try{ clearUser() }catch(e){ /* ignore */ }
    if(currentRole === 'admin'){
      router.push('/admin/login')
    }else{
      router.push('/login')
    }
    ElMessage.success('已退出')
  }).catch(() => {
    ElMessage.info('已取消')
  })
}
</script>

<style scoped>
.header-bar{
  height:64px;
  min-height:64px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  background: linear-gradient(90deg, #e6f7ff, #ffffff);
  border-bottom: 1px solid rgba(15,23,36,0.06);
}
.brand{font-weight:700;color:#0f1724}
.right button{margin-left:12px;padding:8px 12px;border-radius:8px;border:1px solid rgba(15,23,36,0.06);background:transparent;color:#0f1724;min-height:40px;line-height:1}
.right .primary{background:linear-gradient(90deg,#06b6d4,#3b82f6);border:none;color:#fff}
</style>
