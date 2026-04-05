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
            @click="openConv(c.id)"
          >
            <div class="history-avatar">会</div>

            <div class="history-main">
              <div class="history-role">{{ c.title }}</div>
              <div class="history-snippet">{{ getConversationPreviewShort(c, 80) }}</div>
            </div>
          </li>
        </ul>
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
import { computed } from 'vue'
import store, { selectConversation, newConversation, setSelectedDatabase } from '../../stores/store'

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

function openConv(id) {
  selectConversation(id)
}

function createNew() {
  newConversation()
}

function getConversationPreview(conv) {
  if (!conv || !Array.isArray(conv.messages) || conv.messages.length === 0) {
    return '（空）'
  }

  const lastMsg = conv.messages[conv.messages.length - 1]

  if (typeof lastMsg.text === 'string' && lastMsg.text.trim()) {
    return lastMsg.text
  }

  if (lastMsg.type === 'lats_result' && lastMsg.data) {
    const data = lastMsg.data

    if (data.optimizedSql) {
      return `SQL优化结果：${data.optimizedSql}`
    }

    if (data.originalSql) {
      return `SQL优化结果：${data.originalSql}`
    }

    return 'SQL优化结果'
  }

  return '（空）'
}

function getConversationPreviewShort(conv, maxLen = 80) {
  const text = getConversationPreview(conv)
  if (!text) return '（空）'
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}
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

.panel li{
  padding:8px;
  border-radius:6px;
  cursor:pointer;
  color:#0f1724;
}

.panel li:hover{
  background:rgba(15,23,36,0.03);
}

.setting{
  color:#475569;
}

.history-item{
  display:flex;
  gap:8px;
  align-items:flex-start;
  padding:8px;
  border-radius:6px;
  border:1px solid rgba(15,23,36,0.04);
  margin-bottom:8px;
  background:#fbfdff;
}

.history-avatar{
  flex:0 0 36px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:6px;
  background:#eef2ff;
  color:#3730a3;
  font-weight:700;
}

.history-main{
  flex:1;
  min-width:0;
}

.history-role{
  font-weight:600;
  color:#0f1724;
  margin-right:6px;
}

.history-snippet{
  color:#334155;
  word-break:break-word;
  line-height:1.5;
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
}
</style>