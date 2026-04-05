import { reactive } from 'vue'

const store = reactive({
  conversations: [],
  currentId: null
})

// reactive user state for login status
store.user = null

// selected database for future use
store.selectedDatabase = 'sample_db_a'

export function setSelectedDatabase(id) {
  store.selectedDatabase = id
}

export function newConversation(title = '新对话') {
  const conv = { id: Date.now() + Math.random(), title, messages: [] }
  // put newest at the front
  store.conversations.unshift(conv)
  store.currentId = conv.id
  return conv
}

export function setUser(u) {
  store.user = u
}

export function clearUser() {
  store.user = null
}

export function selectConversation(id) {
  store.currentId = id
}

/**
 * 支持两种消息写法：
 * 1. 普通文本消息
 *    pushMessage('user', 'SELECT * FROM ...')
 *
 * 2. 结构化消息
 *    pushMessage('assistant', {
 *      type: 'lats_result',
 *      data: {...}
 *    })
 */
export function pushMessage(role, payload) {
  let conv = store.conversations.find(c => c.id === store.currentId)
  if (!conv) {
    conv = newConversation()
  }

  let message = {
    id: Date.now() + Math.random(),
    role
  }

  if (typeof payload === 'string') {
    message.text = payload
  } else if (payload && typeof payload === 'object') {
    message = {
      ...message,
      ...payload
    }
  } else {
    message.text = ''
  }

  conv.messages.push(message)

  // 自动用第一条用户消息更新会话标题
  if (conv.title === '新对话') {
    const firstUserMsg = conv.messages.find(m => m.role === 'user')
    const firstText = firstUserMsg?.text || ''
    if (firstText) {
      conv.title = firstText.length > 12 ? firstText.slice(0, 12) + '...' : firstText
    }
  }
}

export function clearCurrentMessages() {
  const conv = store.conversations.find(c => c.id === store.currentId)
  if (conv) conv.messages.length = 0
}

export default store