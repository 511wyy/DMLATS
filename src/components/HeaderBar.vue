<template>
  <header class="header-bar">
    <div class="brand">DeepSeek-like Chat</div>
    <div class="right">
      <button class="ghost">新建会话</button>
      <button class="primary">登录</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderBar'
}
</script>

<style scoped>
.header-bar{
  height:64px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.brand{font-weight:700;color:#fff}
.right button{margin-left:12px;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:#e6eef8}
.right .primary{background:linear-gradient(90deg,#4f46e5,#06b6d4);border:none}
</style>
