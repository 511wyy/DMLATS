<template>
  <div class="admin-page">
    <AdminSidebar @select="tab = $event" :active="tab" />
    <div class="admin-main">
      <UserTable v-if="tab === 'manage'" />
      <UserAnalysis v-else />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import UserTable from '../../components/admin/UserTable.vue'
import UserAnalysis from '../../components/admin/UserAnalysis.vue'

const tab = ref('manage')
</script>

<style scoped>
.admin-page{ 
    display:flex; 
    gap:20px; 
    padding:16px;
    width: 100%;
}
.admin-main{ 
    flex:1 
}
</style>
