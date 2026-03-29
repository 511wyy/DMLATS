<template>
  <div class="user-table">
    <h3>用户管理</h3>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" @click="openChangePwd(row)">修改密码</el-button>
          <el-button size="small" type="danger" @click="deleteUser(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model:visible="showPwdModal" width="420px" title="修改密码">
      <div v-if="selectedUser">为 {{ selectedUser.name }} 修改密码</div>
      <el-input v-model="newPwd" type="password" placeholder="输入新密码" style="margin-top:12px" />
      <template #footer>
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="applyPwd">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'user' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'admin' }
])

const showPwdModal = ref(false)
const selectedUser = ref(null)
const newPwd = ref('')

function deleteUser(id){
  const ok = window.confirm('确定删除该用户？')
  if(!ok) return
  users.value = users.value.filter(u => u.id !== id)
  window.alert('已删除 (模拟)')
}

function openChangePwd(u){ selectedUser.value = u; newPwd.value = ''; showPwdModal.value = true }
function closeModal(){ showPwdModal.value = false; selectedUser.value = null }
function applyPwd(){
  // 模拟密码修改
  window.alert(`已为 ${selectedUser.value.name} 修改密码：${newPwd.value} (模拟)`)
  closeModal()
}
</script>

<style scoped>
.user-table{ 
    background:#fff; 
    padding:16px; 
    border-radius:8px;
    width: 100%; 
}
table{ 
    width:100%; 
    border-collapse:collapse 
}
th, td{ 
    padding:8px; 
    border-bottom:1px solid #eef2f7 
}
button{ 
    margin-right:8px 
}
.modal{ 
    position:fixed; 
    inset:0; 
    display:flex; 
    align-items:center; 
    justify-content:center; 
    background:rgba(0,0,0,0.3) 
}
.modal-inner{ 
    background:#fff; 
    padding:16px; 
    border-radius:8px; 
    min-width:320px 
}
.modal-actions{ 
    margin-top:12px; 
    display:flex; 
    gap:8px 
}
</style>
