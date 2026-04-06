import { postRequest } from '@/utils/api'

export default {
  async sendMessage(prompt) {
    try {
      const res = await postRequest('/api/lats/optimize', {
        sql: prompt,
      })

      const data = res

      if (!data) {
        throw new Error('后端返回为空')
      }

      if (data.code !== 200) {
        throw new Error(data.message || '优化失败')
      }

      return data
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