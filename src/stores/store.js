import { reactive } from 'vue'

const store = reactive({
  conversations: [],
  currentId: null
})

// selected database for future use
store.selectedDatabase = 'sample_db_a'

export function setSelectedDatabase(id){
  store.selectedDatabase = id
}

export function newConversation(title = '新对话'){
  const conv = { id: Date.now() + Math.random(), title, messages: [] }
  // put newest at the front
  store.conversations.unshift(conv)
  store.currentId = conv.id
  return conv
}

export function selectConversation(id){
  store.currentId = id
}

export function pushMessage(role, text){
  let conv = store.conversations.find(c => c.id === store.currentId)
  if(!conv){
    conv = newConversation()
  }
  conv.messages.push({ id: Date.now() + Math.random(), role, text })
}

export function clearCurrentMessages(){
  const conv = store.conversations.find(c => c.id === store.currentId)
  if(conv) conv.messages.length = 0
}

export default store
