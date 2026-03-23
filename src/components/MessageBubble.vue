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
.bubble{
  max-width:30%;
  padding:12px;
  border-radius:12px;
  margin:8px 0;
  word-break:break-word
}
.bubble.user{
  margin-left:auto;
  background:linear-gradient(90deg,#06b6d4,#3b82f6);
  color:#ffffff
}
.bubble.assistant{
  background:#f1f5f9;
  color:#0f1724
}
.content{
  white-space:pre-wrap
}
</style>
