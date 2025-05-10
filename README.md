# KnowledgeFlowCompiler

KnowledgeFlowCompiler是一个网页端的信息流应用，用于论文总结及RAG问答。

## 主要功能

- 推送论文总结及相关文章
- 允许用户将感兴趣的论文保存到个人集合中（通过拖放或左滑）
- 基于保存的论文集合进行RAG问答
- 多功能侧栏支持书柜、收藏、研究热榜等不同视图
- 搜索功能支持关键词高亮和搜索历史
- 页面导航功能如刷新和回到顶端

## 技术栈

- **前端框架**: Next.js + React
- **UI组件库**: Chakra UI
- **动画库**: Framer Motion
- **拖拽功能**: @dnd-kit
- **状态管理**: Zustand

## 项目结构

```
kfc-web/
├── src/
│   ├── app/           # Next.js应用入口
│   ├── components/    # React组件
│   ├── store/         # Zustand状态管理
│   └── types/         # TypeScript类型定义
├── public/            # 静态资源
└── package.json       # 项目依赖
```

## 安装与运行

1. 克隆仓库

```bash
git clone https://github.com/yourusername/knowledge-flow-compiler.git
cd knowledge-flow-compiler/kfc-web
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 构建与部署

1. 构建生产版本

```bash
npm run build
```

2. 启动生产服务器

```bash
npm run start
```

## 功能说明

- **文章卡片**: 点击查看全文，拖放到左侧书架保存
- **书架侧栏**: 保存感兴趣的文章，点击展开进入RAG模式
- **侧栏导航**: 支持在书柜、收藏、热榜、设置之间切换
- **搜索功能**: 顶部搜索框支持搜索文章，自动保存搜索历史
- **浮动导航**: 右下角按钮支持刷新内容和回到顶部
- **RAG问答**: 基于书架中的文献进行知识问答（API集成中）

## 用户界面

- **暗色主题**: 黑色背景提供更好的阅读体验
- **动画效果**: 各种交互动画增强用户体验
- **响应式设计**: 适配不同屏幕尺寸

## 开发指南

- 使用`use client`指令标记客户端组件
- 使用`@/`路径别名导入模块
- 使用Zustand进行状态管理，支持持久化存储
- 避免水合错误：动态导入复杂UI组件并设置`ssr: false`

## 常见问题解决

1. **如遇到水合错误**:
   - 检查组件是否使用了`use client`指令
   - 对复杂UI组件使用动态导入并禁用SSR

2. **样式问题**:
   - 确保正确设置Chakra UI主题
   - 避免在Framer Motion动画中直接使用主题变量

3. **拖拽功能问题**:
   - 确保正确包裹了DndProvider
   - 分离拖动和点击事件处理逻辑

## 贡献指南

欢迎贡献代码或提出建议！请遵循以下步骤：

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 未来计划

- RAG问答API集成
- 更多个性化设置
- 用户账户系统
- 主题切换功能

## 许可证

MIT

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
