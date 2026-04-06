import { reactive } from 'vue'

const store = reactive({
  conversations: [],          // 左侧历史会话列表
  currentConversation: null,  // 当前打开的完整会话
  user: getLocalUser(),
  selectedDatabase: 'sample_db_a'
})

function getLocalUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function setSelectedDatabase(id) {
  store.selectedDatabase = id
}

export function setUser(u) {
  store.user = u
  localStorage.setItem('user', JSON.stringify(u))
}

export function clearUser() {
  store.user = null
  localStorage.removeItem('user')
}

export function setConversations(list) {
  store.conversations = Array.isArray(list) ? list : []
}

export function setCurrentConversation(conversation) {
  store.currentConversation = conversation || null
}

export function selectConversation(conversation) {
  store.currentConversation = conversation || null
}

export function newConversation(conversation = null) {
  store.currentConversation = conversation
}

/**
 * 当前会话 id
 */
export function getCurrentConversationId() {
  return store.currentConversation?.id || null
}

/**
 * 兼容旧代码：如果还有地方在用 currentId，可继续通过这个函数拿
 */
export function getCurrentId() {
  return store.currentConversation?.id || null
}

/**
 * 向当前会话追加消息
 * 支持：
 * 1. pushMessage('user', 'SELECT * FROM ...')
 * 2. pushMessage('assistant', { type: 'lats_result', ... })
 */
export function pushMessage(role, payload) {
  if (!store.currentConversation) {
    store.currentConversation = {
      id: null,
      title: '新对话',
      preview: '（空）',
      messages: []
    }
  }

  if (!Array.isArray(store.currentConversation.messages)) {
    store.currentConversation.messages = []
  }

  let message = {
    id: Date.now() + Math.random(),
    role,
    type: 'text',
    textContent: ''
  }

  if (typeof payload === 'string') {
    message.textContent = payload
    message.type = 'text'
  } else if (payload && typeof payload === 'object') {
    message = {
      ...message,
      ...payload
    }
    if (!message.type) {
      message.type = 'text'
    }
  }

  store.currentConversation.messages.push(message)

  // 本地临时更新 preview，方便用户立刻看到变化
  const preview = getMessagePreview(message)
  if (preview) {
    store.currentConversation.preview = preview
  }

  // 如果左侧列表里已有当前会话，也顺手同步 preview/title
  syncCurrentConversationToList()
}

/**
 * 替换当前会话的消息列表
 */
export function setCurrentMessages(messages) {
  if (!store.currentConversation) return
  store.currentConversation.messages = Array.isArray(messages) ? messages : []
  syncCurrentConversationToList()
}

/**
 * 清空当前会话消息
 */
export function clearCurrentMessages() {
  if (!store.currentConversation) return
  store.currentConversation.messages = []
  store.currentConversation.preview = '（空）'
  syncCurrentConversationToList()
}

/**
 * 根据会话详情更新左侧列表中的对应项
 */
export function syncCurrentConversationToList() {
  const conv = store.currentConversation
  if (!conv || conv.id == null) return

  const idx = store.conversations.findIndex(c => c.id === conv.id)
  const listItem = {
    id: conv.id,
    title: conv.title || '新对话',
    preview: conv.preview || buildConversationPreview(conv),
    updateTime: conv.updateTime || null
  }

  if (idx >= 0) {
    store.conversations.splice(idx, 1)
    store.conversations.unshift(listItem)
  } else {
    store.conversations.unshift(listItem)
  }
}

/**
 * 用后端返回的会话详情覆盖当前会话，并同步左侧列表
 */
export function applyConversationDetail(conversation) {
  store.currentConversation = conversation || null
  syncCurrentConversationToList()
}

/**
 * 从消息中提取预览文本
 */
function getMessagePreview(message) {
  if (!message) return '（空）'

  if (typeof message.textContent === 'string' && message.textContent.trim()) {
    return shorten(message.textContent, 80)
  }

  if (typeof message.text === 'string' && message.text.trim()) {
    return shorten(message.text, 80)
  }

  if (message.type === 'lats_result') {
    if (message.optimizedSql) return shorten(`SQL优化结果：${message.optimizedSql}`, 80)
    if (message.originalSql) return shorten(`SQL优化结果：${message.originalSql}`, 80)
    if (message.message) return shorten(message.message, 80)
    return 'SQL优化结果'
  }

  return '（空）'
}

/**
 * 根据整个会话构造预览
 */
function buildConversationPreview(conv) {
  if (!conv) return '（空）'

  if (typeof conv.preview === 'string' && conv.preview.trim()) {
    return shorten(conv.preview, 80)
  }

  if (!Array.isArray(conv.messages) || conv.messages.length === 0) {
    return '（空）'
  }

  const lastMsg = conv.messages[conv.messages.length - 1]
  return getMessagePreview(lastMsg)
}

function shorten(text, maxLen = 80) {
  if (!text) return ''
  const s = String(text).replace(/\s+/g, ' ').trim()
  return s.length > maxLen ? s.slice(0, maxLen) + '…' : s
}

export function removeConversationById(id) {
  store.conversations = Array.isArray(store.conversations)
    ? store.conversations.filter(c => c.id !== id)
    : []

  if (store.currentConversation?.id === id) {
    store.currentConversation = null
    if ('currentId' in store) {
      store.currentId = null
    }
  }
}

export default store