<template>
  <header class="header-bar">
    <div class="brand">DMLATS-达梦SQL自动优化框架</div>
    <div class="right">
      <button class="ghost" @click="createNew">新建会话</button>
      <button class="primary">登录</button>
    </div>
  </header>
</template>

<script setup>
import { newConversation } from '../../services/store'

function createNew(){
  newConversation()
}
</script>

<style scoped>
.header-bar{
  height:64px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  background: linear-gradient(90deg, #e6f7ff, #ffffff);
  border-bottom: 1px solid rgba(15,23,36,0.06);
}
.brand{font-weight:700;color:#0f1724}
.right button{margin-left:12px;padding:8px 12px;border-radius:8px;border:1px solid rgba(15,23,36,0.06);background:transparent;color:#0f1724}
.right .primary{background:linear-gradient(90deg,#06b6d4,#3b82f6);border:none;color:#fff}
</style>
