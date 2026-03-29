<template>
  <div id="app">
    <HeaderBar />
    <div class="app-body">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderBar from './components/user/HeaderBar.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
  }
}
</script>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  color: #0f1724;
}
.app-body {
  display: flex;
  flex: 1 1 auto;
  padding: 24px;
  gap: 20px;
}
</style>
