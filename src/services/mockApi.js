// 简单的 mock 接口，用于返回模拟的聊天回复
export default {
  sendMessage(prompt){
    return new Promise((resolve) => {
      const responses = [
        '这是一个模拟回复，基于您输入的: ' + prompt,
        '我已经理解你的问题，这里是简短回答：...\n（模拟数据）',
        '下面给出几点建议：\n1. 示例一\n2. 示例二\n3. 示例三'
      ]
      const idx = Math.floor(Math.random() * responses.length)
      // 模拟网络延迟
      setTimeout(()=> resolve(responses[idx]), 800 + Math.random()*1200)
    })
  }
}
