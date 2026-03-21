# Lats — 本地前端演示（模拟 LLM 对话界面）

这是一个仿 DeepSeek 风格的前端界面示例，后端接口使用本地 `mockApi` 模拟返回，用于快速展示交互与样式。

快速运行

```bash
npm install
npm run serve
```

说明

- 页面文件：`src/App.vue`、`src/components/*`。
- 模拟接口：`src/services/mockApi.js`。
- 全局样式：`src/styles/global.css`。

下一步（可选）

- 将 `mockApi` 替换为真实 LLM 后端接口（REST / WebSocket）。
- 增加会话持久化（localStorage/后端）。
- 添加消息流式渲染以模拟更真实的生成体验。
# lats

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
