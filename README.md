# KnowledgeFlowCompiler

KnowledgeFlowCompiler是一个网页端的信息流应用，用于论文总结及RAG问答。

## 主要功能

- 推送论文总结及相关文章
- 允许用户将感兴趣的论文保存到个人集合中（通过拖放或左滑）
- 基于保存的论文集合进行RAG问答

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

1. 安装依赖

```bash
npm install
```

2. 启动开发服务器

```bash
npm run dev
```

3. 构建生产版本

```bash
npm run build
```

4. 启动生产服务器

```bash
npm run start
```

## 功能说明

- **文章卡片**: 点击查看全文，拖放到左侧书架保存
- **书架侧栏**: 保存感兴趣的文章，点击展开进入RAG模式
- **RAG问答**: 基于书架中的文献进行知识问答

## 开发说明

- 使用`use client`指令标记客户端组件
- 使用`@/`路径别名导入模块
- 使用Zustand进行状态管理，支持持久化存储
- 使用@dnd-kit实现拖放功能

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
