<template>
  <div class="chat-page">
    <SideBar />

    <main class="chat-view">
      <section class="messages" ref="msgList">
        <div class="meta">
          LATS SQL 优化会话
          <span v-if="currentConversation?.title" class="meta-title">
            / {{ currentConversation.title }}
          </span>
        </div>

        <template v-if="messages.length > 0">
          <MessageBubble
            v-for="m in messages"
            :key="m.id"
            :message="normalizeMessage(m)"
          />
        </template>

        <div v-else class="welcome-card">
          <div class="welcome-title">你好，我是 LATS SQL 优化助手</div>
          <div class="welcome-text">
            请输入需要优化的达梦 SQL，我会返回优化后的 SQL、索引建议、风险点和优化建议。
          </div>
        </div>

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
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch, onMounted } from 'vue'
import MessageBubble from '../../components/user/MessageBubble.vue'
import SideBar from '@/components/user/SideBar.vue'

import store, {
  selectConversation,
  setConversations
} from '../../stores/store'

import {
  createConversationApi,
  listConversationsApi,
  getConversationDetailApi,
  optimizeSqlApi
} from '../../api/conversation'

const input = ref('')
const typing = ref(false)
const msgList = ref(null)

const currentConversation = computed(() => store.currentConversation)

const messages = computed(() => {
  return Array.isArray(store.currentConversation?.messages)
    ? store.currentConversation.messages
    : []
})

const canSend = computed(() => !!input.value.trim())

function scrollToBottom() {
  nextTick(() => {
    if (msgList.value) {
      msgList.value.scrollTop = msgList.value.scrollHeight
    }
  })
}

/**
 * 兼容 MessageBubble 旧结构
 * 你的后端消息结构是：
 * {
 *   id, role, type, textContent, originalSql, optimizedSql, analysis, ...
 * }
 *
 * 如果 MessageBubble 还是按旧结构：
 * - 文本消息：message.text
 * - 结构化消息：message.data
 * 那这里做一次适配即可
 */
function normalizeMessage(m) {
  if (!m) return m

  if (m.type === 'lats_result') {
    return {
      ...m,
      title: 'SQL 优化结果',
      data: {
        originalSql: m.originalSql,
        optimizedSql: m.optimizedSql,
        analysis: tryParseJson(m.analysis),
        indexStrategies: tryParseJson(m.indexStrategies),
        executionTimes: tryParseJson(m.executionTimes),
        iterations: m.iterations,
        totalNodes: m.totalNodes,
        originalTimeMs: m.originalTimeMs,
        optimizedTimeMs: m.optimizedTimeMs,
        improvementRatio: m.improvementRatio,
        code: m.code,
        message: m.message
      },
      text: m.textContent || ''
    }
  }

  return {
    ...m,
    text: m.textContent || m.text || ''
  }
}

function tryParseJson(value) {
  if (!value || typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

async function ensureConversationReadyForSend(firstText) {
  if (store.currentConversation?.id) {
    return store.currentConversation.id
  }

  const createRes = await createConversationApi(firstText || '')
  const conversationId = createRes.data.id

  const detailRes = await getConversationDetailApi(conversationId)
  selectConversation(detailRes.data)

  const listRes = await listConversationsApi()
  setConversations(listRes.data || [])

  return conversationId
}

async function refreshConversationAndList(conversationId) {
  if (!conversationId) return

  const detailRes = await getConversationDetailApi(conversationId)
  selectConversation(detailRes.data)

  const listRes = await listConversationsApi()
  setConversations(listRes.data || [])

  scrollToBottom()
}

async function send() {
  const txt = input.value.trim()
  if (!txt || typing.value) return

  typing.value = true

  try {
    const conversationId = await ensureConversationReadyForSend(txt)

    input.value = ''

    const optimizeRes = await optimizeSqlApi(conversationId, txt)
    const newConversationId = optimizeRes.data?.conversationId || conversationId

    await refreshConversationAndList(newConversationId)
  } catch (e) {
    console.error(e)

    // 如果当前已有会话，尽量把失败消息也显示出来
    if (store.currentConversation?.id) {
      const failedMessage = {
        id: Date.now() + Math.random(),
        role: 'assistant',
        type: 'text',
        textContent: `⚠️ 接口调用失败：${e?.message || '未知错误'}`
      }

      const current = store.currentConversation
      if (!Array.isArray(current.messages)) {
        current.messages = []
      }
      current.messages.push(failedMessage)
    }
  } finally {
    typing.value = false
    scrollToBottom()
  }
}

function clear() {
  if (typing.value) return
  input.value = ''
}

onMounted(async () => {
  scrollToBottom()
})

watch(
  () => store.currentConversation?.id,
  () => {
    input.value = ''
    nextTick(() => {
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
.chat-page{
  display:flex;
  gap:16px;
  height:87vh;
  width:100%;
  padding:16px;
  box-sizing:border-box;
  overflow:hidden;
}

.chat-view{
  flex:1;
  display:flex;
  flex-direction:column;
  background:linear-gradient(180deg, #ffffff, #f8fafc);
  padding:16px;
  border-radius:12px;
  min-height:0;
  overflow:hidden;
}

.messages{
  flex:1;
  overflow-y:auto;
  overflow-x:hidden;
  padding:12px 8px;
  min-height:0;
}

.meta{
  font-size:12px;
  color:#475569;
  margin-bottom:8px;
}

.meta-title{
  color:#0f1724;
  font-weight:600;
}

.welcome-card{
  margin-top:8px;
  padding:16px;
  border-radius:12px;
  background:#f8fafc;
  border:1px solid rgba(15,23,36,0.06);
}

.welcome-title{
  font-size:16px;
  font-weight:600;
  color:#0f1724;
  margin-bottom:8px;
}

.welcome-text{
  font-size:14px;
  color:#475569;
  line-height:1.7;
}

.typing{
  color:#64748b;
  font-style:italic;
  margin:8px 0;
}

.composer{
  margin-top:12px;
  flex-shrink:0;
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