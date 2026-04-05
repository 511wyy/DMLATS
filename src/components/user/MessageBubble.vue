<template>
  <div class="bubble-wrap" :class="message.role">
    <div class="avatar">
      {{ message.role === 'user' ? '我' : 'AI' }}
    </div>

    <div class="bubble">
      <div class="role">
        {{ message.role === 'user' ? '用户' : 'LATS助手' }}
      </div>
      <div class="content">{{ message.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageBubble',
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.bubble-wrap{
  display:flex;
  gap:12px;
  margin:12px 0;
  align-items:flex-start;
}

.bubble-wrap.user{
  flex-direction:row-reverse;
}

.avatar{
  width:36px;
  height:36px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:13px;
  font-weight:600;
  flex-shrink:0;
  background:#e2e8f0;
  color:#0f172a;
}

.bubble-wrap.assistant .avatar{
  background:linear-gradient(135deg,#06b6d4,#3b82f6);
  color:#fff;
}

.bubble{
  max-width:min(920px, 78%);
  padding:12px 14px;
  border-radius:14px;
  box-shadow:0 2px 10px rgba(15,23,42,0.05);
  border:1px solid rgba(15,23,42,0.06);
}

.bubble-wrap.assistant .bubble{
  background:#ffffff;
  color:#0f172a;
}

.bubble-wrap.user .bubble{
  background:linear-gradient(135deg,#dbeafe,#e0f2fe);
  color:#0f172a;
}

.role{
  font-size:12px;
  color:#64748b;
  margin-bottom:8px;
}

.content{
  white-space:pre-wrap;
  word-break:break-word;
  line-height:1.7;
  font-size:14px;
  overflow-x:auto;
}
</style>