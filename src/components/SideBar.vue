<template>
  <aside class="sidebar">
    <div class="panel">
      <h3>示例提示</h3>
      <ul>
        <li v-for="(p, idx) in prompts" :key="idx" @click="$emit('usePrompt', p)">"{{ p }}"</li>
      </ul>
    </div>
    <div class="panel">
      <h3>设置</h3>
      <div class="setting">模型: <select><option>gpt-mock</option></select></div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SideBar',
  data(){
    return {
      prompts:[
        '用100字概述区块链的工作原理',
        '写一封用于产品发布的营销邮件模板',
        '帮我把下面句子翻译成英文：我们已经上线了新功能'
      ]
    }
  }
}
</script>

<style scoped>
.sidebar{width:280px;display:flex;flex-direction:column;gap:16px}
.panel{background:rgba(255,255,255,0.02);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.03)}
.panel h3{margin:0 0 8px 0;font-size:14px;color:#cfe9ff}
.panel ul{list-style:none;padding:0;margin:0}
.panel li{padding:8px;border-radius:6px;cursor:pointer;color:#e6eef8}
.panel li:hover{background:rgba(255,255,255,0.02)}
.setting{color:#cbd5e1}
</style>
