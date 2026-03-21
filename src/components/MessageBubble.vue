<template>
  <div :class="['bubble', message.role === 'user' ? 'user' : 'assistant']">
    <div class="content">{{ message.text }}</div>
  </div>
</template>

<script>
export default {
  name: 'MessageBubble',
  props: {
    message: { type: Object, required: true }
  }
}
</script>

<style scoped>
.bubble{max-width:75%;padding:12px;border-radius:12px;margin:8px 0;word-break:break-word}
.bubble.user{margin-left:auto;background:linear-gradient(90deg,#0ea5a4,#06b6d4);color:#042027}
.bubble.assistant{background:rgba(255,255,255,0.03);color:#e6eef8}
.content{white-space:pre-wrap}
</style>
