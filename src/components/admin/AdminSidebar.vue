<template>
  <aside class="admin-sidebar">
    <button :class="{active: active === 'manage'}" @click="$emit('select','manage')">用户管理</button>
    <button :class="{active: active === 'analysis'}" @click="$emit('select','analysis')">用户分析</button>
  </aside>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({ active: String })
</script>

<style scoped>
.admin-sidebar{ width:180px; display:flex; flex-direction:column; gap:8px }
.admin-sidebar button{ padding:10px; border-radius:6px; border:1px solid #e5e7eb; background:#fff }
.admin-sidebar button.active{ background:linear-gradient(90deg,#06b6d4,#3b82f6); color:#fff; border:none }
</style>
