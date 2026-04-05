<template>
  <div class="bubble-wrap" :class="message.role">
    <div class="avatar">
      {{ message.role === 'user' ? '我' : 'AI' }}
    </div>

    <div class="bubble">
      <div class="role">
        {{ message.role === 'user' ? '用户' : 'LATS助手' }}
      </div>

      <template v-if="!isStructured">
        <div class="content text-content">{{ plainText }}</div>
      </template>

      <template v-else>
        <div class="result-layout">
          <div class="section-card metrics-card">
            <div class="section-title">优化结果概览</div>
            <div class="metrics-grid">
              <div class="metric-item">
                <div class="metric-label">原始耗时</div>
                <div class="metric-value">{{ displayValue(result.originalTimeMs) }} ms</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">优化后耗时</div>
                <div class="metric-value">{{ displayValue(result.optimizedTimeMs) }} ms</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">提升比例</div>
                <div class="metric-value">{{ displayRatio(result.improvementRatio) }}</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">迭代轮数</div>
                <div class="metric-value">{{ displayValue(result.iterations) }}</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">执行耗时</div>
                <div class="metric-value">{{ displayValue(result.executionTimes) }} ms</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">总节点数</div>
                <div class="metric-value">{{ displayValue(result.totalNodes) }}</div>
              </div>
            </div>
          </div>

          <div v-if="analysisTables.length" class="section-card">
            <div class="section-title">涉及表</div>
            <div class="tag-list">
              <span v-for="table in analysisTables" :key="table" class="tag">
                {{ table }}
              </span>
            </div>
          </div>

          <div v-if="result.originalSql" class="section-card">
            <div class="section-title">原始 SQL</div>
            <pre class="code-block"><code>{{ result.originalSql }}</code></pre>
          </div>

          <div v-if="result.optimizedSql" class="section-card">
            <div class="section-title">优化后 SQL</div>
            <pre class="code-block optimized"><code>{{ result.optimizedSql }}</code></pre>
          </div>

          <div v-if="normalizedIndexStrategies.length" class="section-card">
            <div class="section-title">索引建议</div>
            <div class="index-list">
              <div
                v-for="(idx, i) in normalizedIndexStrategies"
                :key="idx.name || i"
                class="index-card"
              >
                <div class="index-header">
                  <div class="index-name">{{ idx.name || '未命名索引' }}</div>
                  <span class="index-type">{{ idx.type || '-' }}</span>
                </div>

                <div class="index-meta">
                  <div><strong>Schema：</strong>{{ idx.schema || '-' }}</div>
                  <div><strong>表：</strong>{{ idx.table || '-' }}</div>
                  <div><strong>列：</strong>{{ formatColumns(idx.columns) }}</div>
                </div>

                <div v-if="idx.ddl" class="sub-block">
                  <div class="sub-title">DDL</div>
                  <pre class="code-block small"><code>{{ idx.ddl }}</code></pre>
                </div>

                <div v-if="idx.rationale" class="sub-block">
                  <div class="sub-title">说明</div>
                  <div class="desc-text">{{ idx.rationale }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="riskPoints.length" class="section-card warning-card">
            <div class="section-title">风险点</div>
            <ul class="list-block risk-list">
              <li v-for="(item, i) in riskPoints" :key="i">{{ item }}</li>
            </ul>
          </div>

          <div v-if="optimizationOpportunities.length" class="section-card success-card">
            <div class="section-title">优化建议</div>
            <ul class="list-block suggestion-list">
              <li v-for="(item, i) in optimizationOpportunities" :key="i">{{ item }}</li>
            </ul>
          </div>

          <div v-if="executionPlan" class="section-card">
            <div class="section-title plan-title-row">
              <span>执行计划</span>
              <button class="toggle-btn" @click="planExpanded = !planExpanded">
                {{ planExpanded ? '收起' : '展开' }}
              </button>
            </div>
            <pre v-if="planExpanded" class="code-block plan-block"><code>{{ executionPlan }}</code></pre>
          </div>
        </div>
      </template>
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
  },
  data() {
    return {
      planExpanded: false
    }
  },
  computed: {
    isStructured() {
      return this.message?.type === 'lats_result' && this.message?.data
    },
    plainText() {
      return this.message?.text || this.message?.content || ''
    },
    result() {
      return this.message?.data || {}
    },
    analysis() {
      return this.result?.analysis || {}
    },
    analysisTables() {
      return this.analysis?.tables || []
    },
    riskPoints() {
      return this.analysis?.risk_points || this.analysis?.riskPoints || []
    },
    optimizationOpportunities() {
      return this.analysis?.optimization_opportunities || this.analysis?.optimizationOpportunities || []
    },
    executionPlan() {
      return this.analysis?.execution_plan || this.analysis?.executionPlan || ''
    },
    normalizedIndexStrategies() {
      const source = this.result?.indexStrategies
      if (!source) return []
      if (Array.isArray(source)) return source
      if (typeof source === 'object') return [source]
      return []
    }
  },
  methods: {
    displayValue(val) {
      if (val === null || val === undefined || val === '') return '-'
      if (typeof val === 'number') {
        return Number.isInteger(val) ? String(val) : val.toFixed(4)
      }
      return String(val)
    },
    displayRatio(val) {
      if (val === null || val === undefined || val === '') return '-'
      const num = Number(val)
      if (Number.isNaN(num)) return String(val)
      return `${(num * 100).toFixed(2)}%`
    },
    formatColumns(cols) {
      if (!cols) return '-'
      if (Array.isArray(cols)) return cols.join(', ')
      return String(cols)
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
  width:38px;
  height:38px;
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
  max-width:min(980px, 82%);
  padding:14px 16px;
  border-radius:16px;
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
  margin-bottom:10px;
}
.text-content{
  white-space:pre-wrap;
  word-break:break-word;
  line-height:1.7;
  font-size:14px;
}
.result-layout{
  display:flex;
  flex-direction:column;
  gap:12px;
}
.section-card{
  border:1px solid rgba(15,23,42,0.08);
  border-radius:14px;
  background:#f8fafc;
  padding:12px;
}
.metrics-card{
  background:linear-gradient(180deg,#f8fafc,#f1f5f9);
}
.warning-card{
  background:#fff7ed;
  border-color:#fdba74;
}
.success-card{
  background:#ecfeff;
  border-color:#67e8f9;
}
.section-title{
  font-size:14px;
  font-weight:700;
  color:#0f172a;
  margin-bottom:10px;
}
.metrics-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
  gap:10px;
}
.metric-item{
  background:#ffffff;
  border:1px solid rgba(15,23,42,0.06);
  border-radius:12px;
  padding:10px;
}
.metric-label{
  font-size:12px;
  color:#64748b;
  margin-bottom:6px;
}
.metric-value{
  font-size:15px;
  font-weight:700;
  color:#0f172a;
}
.tag-list{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.tag{
  display:inline-flex;
  align-items:center;
  padding:5px 10px;
  border-radius:999px;
  background:#e2e8f0;
  color:#0f172a;
  font-size:12px;
}
.code-block{
  margin:0;
  padding:12px;
  border-radius:12px;
  background:#0f172a;
  color:#e2e8f0;
  overflow-x:auto;
  white-space:pre-wrap;
  word-break:break-word;
  font-size:13px;
  line-height:1.6;
}
.code-block.optimized{
  background:#082f49;
}
.code-block.small{
  font-size:12px;
}
.plan-block{
  max-height:420px;
}
.index-list{
  display:flex;
  flex-direction:column;
  gap:10px;
}
.index-card{
  background:#ffffff;
  border:1px solid rgba(15,23,42,0.08);
  border-radius:12px;
  padding:12px;
}
.index-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  margin-bottom:8px;
}
.index-name{
  font-weight:700;
  color:#0f172a;
  word-break:break-word;
}
.index-type{
  padding:4px 8px;
  border-radius:999px;
  background:#dbeafe;
  color:#1d4ed8;
  font-size:12px;
  white-space:nowrap;
}
.index-meta{
  display:flex;
  flex-direction:column;
  gap:6px;
  font-size:13px;
  color:#334155;
}
.sub-block{
  margin-top:10px;
}
.sub-title{
  font-size:12px;
  font-weight:700;
  color:#475569;
  margin-bottom:6px;
}
.desc-text{
  white-space:pre-wrap;
  word-break:break-word;
  line-height:1.6;
  font-size:13px;
}
.list-block{
  margin:0;
  padding-left:20px;
  color:#1e293b;
  line-height:1.8;
}
.plan-title-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}
.toggle-btn{
  border:none;
  background:#e2e8f0;
  color:#0f172a;
  border-radius:8px;
  padding:6px 10px;
  cursor:pointer;
  font-size:12px;
}
.toggle-btn:hover{
  background:#cbd5e1;
}
@media (max-width: 768px){
  .bubble{
    max-width:100%;
  }
  .metrics-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
  .index-header{
    flex-direction:column;
    align-items:flex-start;
  }
}
</style>