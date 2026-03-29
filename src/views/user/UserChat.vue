<template>
  <SideBar />
  <main class="chat-view">
    <section class="messages" ref="msgList">
      <div class="meta">会话框</div>
      <MessageBubble v-for="m in messages" :key="m.id" :message="m" />
      <div v-if="typing" class="typing">正在分析…</div>
    </section>

    <section class="composer">
      <div class="input-row">
        <textarea v-model="input" @keydown.enter.prevent="send" placeholder="按 Enter 发送"></textarea>
        <div class="controls">
          <button class="ghost" @click="clear">清除</button>
          <button class="primary" @click="send">发送</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, nextTick, computed, watch } from 'vue'
import MessageBubble from '../../components/user/MessageBubble.vue'
import SideBar from '@/components/user/SideBar.vue'
import mockApi from '../../services/mockApi'
import store, { pushMessage as storePush, newConversation } from '../../services/store'

const messages = computed(() => {
  const conv = store.conversations.find(c => c.id === store.currentId)
  return conv ? conv.messages : []
})
const input = ref('')
const typing = ref(false)
const msgList = ref(null)

function pushLocal(role, text){
  storePush(role, text)
  nextTick(()=>{ if(msgList.value) msgList.value.scrollTop = msgList.value.scrollHeight })
}

async function send(){
  const txt = input.value && input.value.trim()
  if(!txt) return
  pushLocal('user', txt)
  input.value = ''
  typing.value = true
  try{
    const reply = await mockApi.sendMessage(txt)
    pushLocal('assistant', reply)
  }catch(e){
    pushLocal('assistant', '⚠️ 模拟接口错误：' + (e.message||e))
  }finally{
    typing.value = false
  }
}

function clear(){ input.value = '' }

if(!store.currentId){
  newConversation()
}
if(messages.value.length === 0){
  pushLocal('assistant', '你好！请输入您需要优化的达梦SQL')
}

watch(() => store.currentId, () => { input.value = '' })
</script>

<style scoped>
.chat-view{
  flex:1;
  display:flex;
  flex-direction:column;
  background:linear-gradient(180deg, #ffffff, #f8fafc);
  padding:16px;
  border-radius:12px
}
.messages{
  flex:1;
  overflow:auto;
  padding:12px 8px
}
.meta{
  font-size:12px;
  color:#475569;
  margin-bottom:8px
}
.typing{
  color:#64748b;
  font-style:italic;
  margin:8px 0
}
.composer{
  margin-top:12px
}
.input-row{
  display:flex;
  gap:12px
}
.input-row textarea{
  flex:1;
  min-height:56px;
  max-height:160px;
  padding:10px;
  border-radius:10px;
  background:#ffffff;
  border:1px solid rgba(15,23,36,0.06);
  color:#0f1724
}
.controls{
  display:flex;
  flex-direction:column;
  gap:8px
}
.controls .ghost{
  background:transparent;
  border:1px solid rgba(15,23,36,0.06);
  padding:8px 12px;
  border-radius:10px;
  color:#0f1724
}
.controls .primary{
  background:linear-gradient(90deg,#06b6d4,#3b82f6);
  border:none;
  padding:8px 12px;
  border-radius:10px;
  color:#ffffff
}
</style>
