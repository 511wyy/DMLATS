<template>
  <div class="user-analysis">
    <h3>用户行为与提问分析</h3>
    <div class="charts-grid">
      <div class="chart" ref="pieRef"></div>
      <div class="chart" ref="barRef"></div>
      <div class="chart" ref="lineRef"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const pieRef = ref(null)
const barRef = ref(null)
const lineRef = ref(null)
let pieChart = null
let barChart = null
let lineChart = null
let resizeHandler = null

// mock data
const categoryData = [
  { category: 'SQL 优化', value: 42 },
  { category: '索引建议', value: 18 },
  { category: '权限问题', value: 12 },
  { category: '性能调优', value: 28 }
]

// questions per day (last 7 days)
const days = (() => {
  const d = []
  for(let i=6;i>=0;i--){ const x = new Date(); x.setDate(x.getDate()-i); d.push(x.toLocaleDateString().replace(/\//g,'-')) }
  return d
})()
const dailyCounts = [12, 18, 25, 22, 30, 27, 35]

// active users (last 7 days)
const activeUsers = [5,6,7,6,8,9,10]

onMounted(async ()=>{
  let echarts = null
  try{ echarts = (await import('echarts')).default || await import('echarts') }catch(e){ echarts = null }

  pieChart = echarts.init(pieRef.value)
  barChart = echarts.init(barRef.value)
  lineChart = echarts.init(lineRef.value)

  pieChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [ { name: '提问分类', type: 'pie', radius: ['40%', '70%'], data: categoryData.map(m=>({value:m.value,name:m.category})) } ]
  })

  barChart.setOption({
    title: { text: '最近7天提问量' },
    tooltip: {},
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [ { type: 'bar', data: dailyCounts, name: '提问数' } ]
  })

  lineChart.setOption({
    title: { text: '最近7天活跃用户' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [ { type: 'line', data: activeUsers, name: '活跃用户', smooth: true } ]
  })

  resizeHandler = () => { pieChart && pieChart.resize(); barChart && barChart.resize(); lineChart && lineChart.resize() }
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(()=>{
  if(pieChart){ pieChart.dispose(); pieChart = null }
  if(barChart){ barChart.dispose(); barChart = null }
  if(lineChart){ lineChart.dispose(); lineChart = null }
  if(resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
.user-analysis{ padding:8px }
.charts-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:12px }
.chart{ height:360px; background:#fff; border-radius:8px; padding:8px }
.chart:nth-child(3){ grid-column: 1 / -1 }
@media (max-width:800px){ .charts-grid{ grid-template-columns: 1fr } .chart{ height:300px } }
</style>
