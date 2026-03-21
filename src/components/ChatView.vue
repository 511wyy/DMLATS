<template>
  <main class="chat-view">
    <section class="messages" ref="msgList">
      <div class="meta">会话 — 模拟接口驱动（仅前端）</div>
      <MessageBubble v-for="m in messages" :key="m.id" :message="m" />
      <div v-if="typing" class="typing">AI 正在输入…</div>
    </section>

    <section class="composer">
      <div class="quick">
        <button v-for="p in quickPrompts" :key="p" @click="useQuick(p)">{{ p }}</button>
      </div>
      <div class="input-row">
        <textarea v-model="input" @keydown.enter.prevent="send" placeholder="向 AI 提问，按 Enter 发送"></textarea>
        <div class="controls">
          <button class="ghost" @click="clear">清除</button>
          <button class="primary" @click="send">发送</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import MessageBubble from './MessageBubble.vue'
import mockApi from '../services/mockApi'

const messages = reactive([])
const input = ref('')
const typing = ref(false)
const msgList = ref(null)

const quickPrompts = [
  '帮我写一段产品简介',
  '生成一份面试题清单',
  '总结以下文本的要点：'
]

function pushMessage(role, text){
  messages.push({ id: Date.now() + Math.random(), role, text })
  nextTick(()=>{ if(msgList.value) msgList.value.scrollTop = msgList.value.scrollHeight })
}

async function send(){
  const txt = input.value && input.value.trim()
  if(!txt) return
  pushMessage('user', txt)
  input.value = ''
  typing.value = true
  try{
    const reply = await mockApi.sendMessage(txt)
    pushMessage('assistant', reply)
  }catch(e){
    pushMessage('assistant', '⚠️ 模拟接口错误：' + (e.message||e))
  }finally{
    typing.value = false
  }
}

function useQuick(p){ input.value = p }
function clear(){ input.value = '' }

// seed welcome
pushMessage('assistant', '你好！这是一个基于模拟接口的演示聊天界面，样式仿 DeepSeek，接口为 mock。')
</script>

<style scoped>
.chat-view{flex:1;display:flex;flex-direction:column;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);padding:16px;border-radius:12px}
.messages{flex:1;overflow:auto;padding:12px 8px}
.meta{font-size:12px;color:#9fb8d9;margin-bottom:8px}
.typing{color:#a0aec0;font-style:italic;margin:8px 0}
.composer{margin-top:12px}
.quick{display:flex;gap:8px;margin-bottom:8px}
.quick button{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.03);padding:6px 10px;border-radius:8px;color:#e6eef8}
.input-row{display:flex;gap:12px}
.input-row textarea{flex:1;min-height:56px;max-height:160px;padding:10px;border-radius:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.03);color:#e6eef8}
.controls{display:flex;flex-direction:column;gap:8px}
.controls .ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);padding:8px 12px;border-radius:10px;color:#e6eef8}
.controls .primary{background:linear-gradient(90deg,#06b6d4,#4f46e5);border:none;padding:8px 12px;border-radius:10px;color:#042027}
</style>
