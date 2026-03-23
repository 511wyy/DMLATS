<template>
  <aside class="sidebar">
    <div class="panel">
      <h3>历史记录</h3>
      <ul>
        <li v-for="c in conversations" :key="c.id" class="history-item" @click="openConv(c.id)">
          <div style="flex:0 0 36px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:#eef2ff;color:#3730a3;font-weight:700">会</div>
          <div style="flex:1">
            <div class="history-role">{{ c.title }}</div>
            <div class="history-snippet">{{ c.messages.length ? (c.messages[c.messages.length-1].text.slice(0,80) + (c.messages[c.messages.length-1].text.length>80?'…':'')) : '（空）' }}</div>
          </div>
        </li>
      </ul>
      <button style="margin-top:8px;padding:8px 10px;border-radius:8px;border:1px solid rgba(15,23,36,0.06);background:#ffffff;color:#0f1724" @click="createNew">新建对话</button>
    </div>
    <div class="panel">
      <h3>设置</h3>
      <div class="setting">数据库: 
        <select v-model="selectedDb">
          <option v-for="d in databases" :key="d.value" :value="d.value">{{ d.label }}</option>
        </select>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import store, { selectConversation, newConversation, setSelectedDatabase } from '../services/store'

const conversations = computed(() => store.conversations)

// databases will later come from an API
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

function openConv(id){
  selectConversation(id)
}

function createNew(){
  newConversation()
}
</script>

<style scoped>
.sidebar{width:280px;display:flex;flex-direction:column;gap:16px}
.panel{background:#ffffff;padding:12px;border-radius:10px;border:1px solid rgba(15,23,36,0.06)}
.panel h3{margin:0 0 8px 0;font-size:14px;color:#0f1724}
.panel ul{list-style:none;padding:0;margin:0}
.panel li{padding:8px;border-radius:6px;cursor:pointer;color:#0f1724}
.panel li:hover{background:rgba(15,23,36,0.03)}
.setting{color:#475569}

.history-item{display:flex;gap:8px;align-items:flex-start;padding:8px;border-radius:6px;border:1px solid rgba(15,23,36,0.04);margin-bottom:8px;background:#fbfdff}
.history-role{font-weight:600;color:#0f1724;margin-right:6px}
.history-snippet{color:#334155}
</style>
