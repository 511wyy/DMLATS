import { getRequest, postRequest, deleteRequest } from '@/utils/api'

export const createConversationApi = (text = '') => {
  return postRequest('/conversations', { text })
}

export const listConversationsApi = () => {
  return getRequest('/conversations')
}

export const getConversationDetailApi = (id) => {
  return getRequest(`/conversations/${id}`)
}

export const optimizeSqlApi = (conversationId, sql) => {
  return postRequest('/api/lats/optimize', {
    conversationId,
    sql
  })
}

export const deleteConversationApi = (id) => {
  return deleteRequest(`/conversations/${id}`)
}