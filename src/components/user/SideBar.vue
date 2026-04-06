<template>
  <aside class="sidebar">
    <div class="panel history-panel">
      <h3>历史记录</h3>

      <div class="history-list">
        <ul>
          <li
            v-for="c in conversations"
            :key="c.id"
            class="history-item"
            :class="{ active: isActive(c.id) }"
            @click="openConv(c.id)"
          >
            <div class="history-avatar">
              {{ isActive(c.id) ? '当前' : '会' }}
            </div>

            <div class="history-main">
              <div class="history-top">
                <div class="history-role" :title="c.title">{{ c.title }}</div>
                <button
                  class="delete-btn"
                  title="删除会话"
                  @click.stop="removeConv(c.id)"
                >
                  删除
                </button>
              </div>

              <div class="history-snippet">
                {{ getConversationPreviewShort(c, 80) }}
              </div>
            </div>
          </li>
        </ul>

        <div v-if="!conversations.length" class="empty-tip">
          暂无历史会话
        </div>
      </div>

      <button class="new-btn" @click="createNew">新建对话</button>
    </div>

    <div class="panel setting-panel">
      <h3>设置</h3>
      <div class="setting">
        数据库:
        <select v-model="selectedDb">
          <option v-for="d in databases" :key="d.value" :value="d.value">
            {{ d.label }}
          </option>
        </select>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import store, {
  selectConversation,
  newConversation,
  setSelectedDatabase,
  setConversations,
  removeConversationById
} from '../../stores/store'

import {
  createConversationApi,
  listConversationsApi,
  getConversationDetailApi,
  deleteConversationApi
} from '../../api/conversation'
import { ElMessageBox, ElMessage } from 'element-plus'


const conversations = computed(() => store.conversations)

const databases = [
  { value: 'sample_db_a', label: '示例数据库 A' },
  { value: 'sample_db_b', label: '示例数据库 B' },
  { value: 'sample_db_c', label: '示例数据库 C' },
  { value: 'local', label: '本地数据库' }
]

const selectedDb = computed({
  get: () => store.selectedDatabase,
  set: (v) => setSelectedDatabase(v)
})

function isActive(id) {
  return store.currentConversation?.id === id
}

async function loadConversations() {
  const res = await listConversationsApi()
  setConversations(res || [])
}

async function openConv(id) {
  if (!id) return
  const res = await getConversationDetailApi(id)
  selectConversation(res)
}

async function createNew() {
  const createRes = await createConversationApi('')
  await loadConversations()

  const detailRes = await getConversationDetailApi(createRes.id)
  newConversation(detailRes)
}

async function removeConv(id) {
   ElMessageBox.confirm('确定要删除会话吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const deletingCurrent = store.currentConversation?.id === id

    await deleteConversationApi(id)
    removeConversationById(id)

    const listRes = await listConversationsApi()
    const list = listRes || []
    setConversations(list)

    if (deletingCurrent) {
      if (list.length > 0) {
        const nextId = list[0].id
        const detailRes = await getConversationDetailApi(nextId)
        console.log(detailRes)
        selectConversation(detailRes)
      } else {
        selectConversation(null)
      }
      console.log(conversations.value)
      return
  }

  // 如果删的不是当前会话，但当前会话对象为空，也兜底打开第一条
  if (!store.currentConversation && list.length > 0) {
    const detailRes = await getConversationDetailApi(list[0].id)
    selectConversation(detailRes)
  }
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

function getConversationPreview(conv) {
  if (!conv) return '（空）'

  if (typeof conv.preview === 'string' && conv.preview.trim()) {
    return conv.preview
  }

  if (!Array.isArray(conv.messages) || conv.messages.length === 0) {
    return '（空）'
  }

  const lastMsg = conv.messages[conv.messages.length - 1]

  if (typeof lastMsg.textContent === 'string' && lastMsg.textContent.trim()) {
    return lastMsg.textContent
  }

  if (lastMsg.type === 'lats_result') {
    if (lastMsg.optimizedSql) return `SQL优化结果：${lastMsg.optimizedSql}`
    if (lastMsg.originalSql) return `SQL优化结果：${lastMsg.originalSql}`
    return 'SQL优化结果'
  }

  return '（空）'
}

function getConversationPreviewShort(conv, maxLen = 80) {
  const text = getConversationPreview(conv)
  if (!text) return '（空）'
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}

onMounted(() => {
  loadConversations()
})
</script>

<style scoped>
.sidebar{
  width:280px;
  flex:0 0 280px;
  display:flex;
  flex-direction:column;
  gap:16px;
  height:100%;
  overflow:hidden;
}

.panel{
  background:#ffffff;
  padding:12px;
  border-radius:10px;
  border:1px solid rgba(15,23,36,0.06);
  overflow:hidden;
}

.history-panel{
  flex:1;
  min-height:0;
  display:flex;
  flex-direction:column;
}

.setting-panel{
  flex-shrink:0;
}

.panel h3{
  margin:0 0 8px 0;
  font-size:14px;
  color:#0f1724;
  flex-shrink:0;
}

.history-list{
  flex:1;
  min-height:0;
  overflow-y:auto;
  padding-right:4px;
}

.history-list ul{
  list-style:none;
  padding:0;
  margin:0;
}

.setting{
  color:#475569;
}

.history-item{
  display:flex;
  gap:8px;
  align-items:flex-start;
  padding:10px;
  border-radius:10px;
  border:1px solid rgba(15,23,36,0.04);
  margin-bottom:8px;
  background:#fbfdff;
  cursor:pointer;
  transition:all .18s ease;
}

.history-item:hover{
  background:rgba(15,23,36,0.03);
  border-color:rgba(59,130,246,0.12);
}

.history-item.active{
  background:linear-gradient(135deg, #eff6ff, #ecfeff);
  border-color:rgba(59,130,246,0.28);
  box-shadow:0 4px 12px rgba(59,130,246,0.10);
}

.history-avatar{
  flex:0 0 36px;
  height:36px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:8px;
  background:#eef2ff;
  color:#3730a3;
  font-weight:700;
  font-size:12px;
}

.history-item.active .history-avatar{
  background:linear-gradient(135deg,#06b6d4,#3b82f6);
  color:#fff;
}

.history-main{
  flex:1;
  min-width:0;
}

.history-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
}

.history-role{
  font-weight:600;
  color:#0f1724;
  min-width:0;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.history-snippet{
  color:#475569;
  word-break:break-word;
  line-height:1.5;
  margin-top:4px;
  font-size:13px;
}

.history-item.active .history-snippet{
  color:#334155;
}

.delete-btn{
  flex-shrink:0;
  border:none;
  background:#fee2e2;
  color:#b91c1c;
  border-radius:8px;
  padding:4px 8px;
  font-size:12px;
  cursor:pointer;
  opacity:0.88;
  transition:all .18s ease;
}

.delete-btn:hover{
  background:#fecaca;
  opacity:1;
}

.new-btn{
  margin-top:8px;
  padding:8px 10px;
  border-radius:8px;
  border:1px solid rgba(15,23,36,0.06);
  background:#ffffff;
  color:#0f1724;
  cursor:pointer;
  flex-shrink:0;
  transition:all .18s ease;
}

.new-btn:hover{
  background:#f8fafc;
  border-color:rgba(59,130,246,0.18);
}

.empty-tip{
  padding:18px 10px;
  text-align:center;
  color:#94a3b8;
  font-size:13px;
}

select{
  margin-left:6px;
  padding:4px 8px;
  border-radius:8px;
  border:1px solid rgba(15,23,36,0.08);
  background:#fff;
}
</style>