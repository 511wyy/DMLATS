<template>
  <div id="app">
    <HeaderBar />
    <div class="app-body">
      <SideBar />
      <ChatView />
    </div>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'
import SideBar from './components/SideBar.vue'
import ChatView from './components/ChatView.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar,
    ChatView
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
