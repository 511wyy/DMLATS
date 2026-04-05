<template>
  <SideBar />
  <main class="chat-view">
    <section class="messages" ref="msgList">
      <div class="meta">LATS SQL 优化会话</div>

      <MessageBubble
        v-for="m in messages"
        :key="m.id"
        :message="m"
      />

      <div v-if="typing" class="typing">正在分析 SQL，请稍候…</div>
    </section>

    <section class="composer">
      <div class="input-row">
        <textarea
          v-model="input"
          :disabled="typing"
          @keydown="handleKeydown"
          placeholder="请输入需要优化的达梦 SQL，Enter 发送，Shift+Enter 换行"
        ></textarea>

        <div class="controls">
          <button class="ghost" :disabled="typing" @click="clear">清除</button>
          <button class="primary" :disabled="typing || !canSend" @click="send">
            {{ typing ? '分析中...' : '发送' }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, nextTick, computed, watch, onMounted } from 'vue'
import MessageBubble from '../../components/user/MessageBubble.vue'
import SideBar from '@/components/user/SideBar.vue'
import mockApi from '../../api/mockApi'
import store, { pushMessage as storePush, newConversation } from '../../stores/store'

const input = ref('')
const typing = ref(false)
const msgList = ref(null)

const messages = computed(() => {
  const conv = store.conversations.find(c => c.id === store.currentId)
  return conv ? conv.messages : []
})

const canSend = computed(() => !!input.value.trim())

function scrollToBottom() {
  nextTick(() => {
    if (msgList.value) {
      msgList.value.scrollTop = msgList.value.scrollHeight
    }
  })
}

function pushLocal(role, text) {
  storePush(role, text)
  scrollToBottom()
}

function ensureConversationInit() {
  if (!store.currentId) {
    newConversation()
  }

  const conv = store.conversations.find(c => c.id === store.currentId)
  if (conv && conv.messages.length === 0) {
    pushLocal(
      'assistant',
      '你好，我是 LATS SQL 优化助手。请输入需要优化的达梦 SQL，我会返回优化后的 SQL、索引建议、风险点和优化建议。'
    )
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

async function send() {
  const txt = input.value.trim()
  if (!txt || typing.value) return

  pushLocal('user', txt)
  input.value = ''
  typing.value = true

  try {
    const reply = await mockApi.sendMessage(txt)
    pushLocal('assistant', reply)
  } catch (e) {
    pushLocal('assistant', `⚠️ 接口调用失败：${e.message || e}`)
  } finally {
    typing.value = false
    scrollToBottom()
  }
}

function clear() {
  if (typing.value) return
  input.value = ''
}

onMounted(() => {
  ensureConversationInit()
  scrollToBottom()
})

watch(
  () => store.currentId,
  () => {
    input.value = ''
    nextTick(() => {
      ensureConversationInit()
      scrollToBottom()
    })
  }
)

watch(
  () => messages.value.length,
  () => {
    scrollToBottom()
  }
)
</script>

<style scoped>
.chat-view{
  flex:1;
  display:flex;
  flex-direction:column;
  background:linear-gradient(180deg, #ffffff, #f8fafc);
  padding:16px;
  border-radius:12px;
  min-height:0;
}

.messages{
  flex:1;
  overflow:auto;
  padding:12px 8px;
}

.meta{
  font-size:12px;
  color:#475569;
  margin-bottom:8px;
}

.typing{
  color:#64748b;
  font-style:italic;
  margin:8px 0;
}

.composer{
  margin-top:12px;
}

.input-row{
  display:flex;
  gap:12px;
}

.input-row textarea{
  flex:1;
  min-height:80px;
  max-height:180px;
  padding:10px;
  border-radius:10px;
  background:#ffffff;
  border:1px solid rgba(15,23,36,0.06);
  color:#0f1724;
  resize:vertical;
  outline:none;
}

.input-row textarea:disabled{
  background:#f8fafc;
  color:#94a3b8;
  cursor:not-allowed;
}

.controls{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.controls button{
  min-width:88px;
}

.controls .ghost{
  background:transparent;
  border:1px solid rgba(15,23,36,0.06);
  padding:8px 12px;
  border-radius:10px;
  color:#0f1724;
  cursor:pointer;
}

.controls .primary{
  background:linear-gradient(90deg,#06b6d4,#3b82f6);
  border:none;
  padding:8px 12px;
  border-radius:10px;
  color:#ffffff;
  cursor:pointer;
}

.controls button:disabled{
  opacity:0.6;
  cursor:not-allowed;
}
</style>