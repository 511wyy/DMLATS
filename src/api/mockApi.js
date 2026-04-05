import { postRequest } from '@/utils/api'

function normalizeIndexStrategies(indexStrategies) {
  if (!indexStrategies) {
    return []
  }

  if (Array.isArray(indexStrategies)) {
    return indexStrategies
  }

  if (typeof indexStrategies === 'object') {
    return [indexStrategies]
  }

  return []
}

function formatIndexStrategies(indexStrategies) {
  const strategyList = normalizeIndexStrategies(indexStrategies)

  if (!strategyList.length) {
    return '无'
  }

  return strategyList.map((item, idx) => {
    const cols = Array.isArray(item.columns) ? item.columns.join(', ') : ''
    return [
      `${idx + 1}. 索引名：${item.name || '-'}`,
      `   表：${item.table || '-'}`,
      `   Schema：${item.schema || '-'}`,
      `   列：${cols || '-'}`,
      `   类型：${item.type || '-'}`,
      `   DDL：${item.ddl || '-'}`,
      item.rationale ? `   说明：${item.rationale}` : null
    ].filter(Boolean).join('\n')
  }).join('\n\n')
}

function formatList(title, arr) {
  if (!arr || !arr.length) {
    return `${title}：无`
  }
  return `${title}：\n${arr.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}`
}

function formatAnalysis(analysis) {
  if (!analysis) {
    return '分析结果：无'
  }

  const parts = []

  const tables = analysis.tables || []
  const riskPoints = analysis.risk_points || analysis.riskPoints || []
  const optimizationOpportunities =
    analysis.optimization_opportunities || analysis.optimizationOpportunities || []

  if (tables.length) {
    parts.push(`涉及表：${tables.join('、')}`)
  }

  if (riskPoints.length) {
    parts.push(formatList('风险点', riskPoints))
  }

  if (optimizationOpportunities.length) {
    parts.push(formatList('优化建议', optimizationOpportunities))
  }

  return parts.length ? parts.join('\n\n') : '分析结果：无'
}

function formatOptimizeResult(data) {
  if (!data) {
    return '未返回优化结果'
  }

  const parts = [
    '优化完成',
    '',
    `原始 SQL：\n${data.originalSql || '-'}`,
    '',
    `优化后 SQL：\n${data.optimizedSql || '-'}`,
    '',
    `原始耗时(ms)：${data.originalTimeMs ?? '-'}`,
    `优化后耗时(ms)：${data.optimizedTimeMs ?? '-'}`,
    `提升比例：${data.improvementRatio ?? '-'}`,
    `迭代轮数：${data.iterations ?? '-'}`,
    `总节点数：${data.totalNodes ?? '-'}`
  ]

  if (data.executionTimes !== undefined && data.executionTimes !== null) {
    if (Array.isArray(data.executionTimes)) {
      parts.push(`执行耗时列表(ms)：${data.executionTimes.join(', ')}`)
    } else {
      parts.push(`执行耗时(ms)：${data.executionTimes}`)
    }
  }

  parts.push('')
  parts.push(`索引建议：\n${formatIndexStrategies(data.indexStrategies)}`)
  parts.push('')
  parts.push(formatAnalysis(data.analysis))

  return parts.join('\n')
}

export default {
  async sendMessage(prompt) {
    try {
      const res = await postRequest('/api/lats/optimize', {
        sql: prompt,
      })
      console.log('res:',res)

      const data = res

      if (!data) {
        throw new Error('后端返回为空')
      }

      if (data.code !== 200) {
        throw new Error(data.message || '优化失败')
      }

      return formatOptimizeResult(data)
    } catch (e) {
      console.error('sendMessage error', e)

      if (e.response) {
        const responseData = e.response.data

        if (typeof responseData === 'string') {
          throw new Error(`后端错误(${e.response.status})：${responseData}`)
        }

        if (responseData?.message) {
          throw new Error(`后端错误(${e.response.status})：${responseData.message}`)
        }

        throw new Error(`后端错误(${e.response.status})`)
      }

      throw new Error(e.message || '请求失败')
    }
  }
}