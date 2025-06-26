# KnowledgeFlowCompiler

KnowledgeFlowCompiler是一个网页端的信息流应用，用于论文总结及RAG问答。

## ✨ 主要功能

- 📚 推送论文总结及相关文章
- 🗂️ 允许用户将感兴趣的论文保存到个人集合中（通过拖放或左滑）
- 🤖 基于保存的论文集合进行RAG问答
- 📱 多功能侧栏支持书柜、收藏、研究热榜等不同视图
- 🔍 搜索功能支持关键词高亮和搜索历史
- 🔐 用户认证系统（登录/注册）
- 🎨 美观的暗色主题界面

## 🚀 技术栈

- **前端框架**: Next.js 14 + React 19
- **UI组件库**: Chakra UI
- **动画库**: Framer Motion
- **拖拽功能**: @dnd-kit
- **状态管理**: Zustand（支持持久化）
- **认证系统**: 内置用户管理
- **语言**: TypeScript

## 📁 项目结构

```
kfc-web/
├── src/
│   ├── app/           # Next.js应用入口
│   │   ├── login/     # 登录页面
│   │   ├── register/  # 注册页面
│   │   └── page.tsx   # 主应用页面
│   ├── components/    # React组件
│   │   ├── AuthGuard.tsx      # 路由保护
│   │   ├── UserProfile.tsx    # 用户资料
│   │   ├── RagQueryUI.tsx     # RAG对话界面
│   │   └── ...               # 其他组件
│   ├── store/         # Zustand状态管理
│   │   ├── authStore.ts       # 认证状态
│   │   ├── articleStore.ts    # 文章状态
│   │   └── ...               # 其他store
│   └── types/         # TypeScript类型定义
├── public/            # 静态资源
└── package.json       # 项目依赖
```

## 🛠️ 开发环境设置

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本
- 现代浏览器（Chrome, Firefox, Safari, Edge）

### 本地开发

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/knowledge-flow-compiler.git
cd knowledge-flow-compiler/kfc-web
```

2. **安装依赖**

```bash
npm install
```

如果遇到依赖冲突，可以使用：
```bash
npm install --legacy-peer-deps
```

3. **启动开发服务器**

```bash
npm run dev
```

4. **访问应用**

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 开发服务器选项

```bash
# 标准开发模式
npm run dev

# 开发模式 + 其他端口
npm run dev -- -p 3001

# 开发模式 + Turbo（如果支持）
npm run dev --turbo
```

## 🔐 用户认证系统

### 登录流程

1. 首次访问应用会自动跳转到登录页面
2. 使用以下测试账户登录：
   - 用户名: `demo` / 密码: `demo123`
   - 用户名: `test` / 密码: `test123`
3. 或点击"立即注册"创建新账户

### 注册流程

1. 从登录页面点击"立即注册"
2. 填写用户名（至少3个字符）
3. 填写有效邮箱地址
4. 设置密码（至少6个字符）
5. 确认密码
6. 注册成功后自动登录

### 用户功能

- ✅ 登录状态持久化保存
- ✅ 右上角用户信息菜单
- ✅ 安全登出功能
- ✅ 路由保护（未登录自动跳转）

## 📦 构建与部署

### 本地构建测试

```bash
# 构建生产版本
npm run build

# 本地预览生产版本
npm run start
```

### 部署到 Vercel（推荐）

Vercel 是 Next.js 官方推荐的部署平台，支持零配置部署。

#### 方法一：通过 Vercel CLI

1. **安装 Vercel CLI**

```bash
npm install -g vercel
```

2. **登录 Vercel**

```bash
vercel login
```

3. **部署项目**

```bash
# 在项目根目录（kfc-web/）运行
vercel

# 或者直接部署到生产环境
vercel --prod
```

#### 方法二：通过 GitHub 集成

1. **推送代码到 GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **在 Vercel 控制台**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 选择 `kfc-web` 目录作为根目录
   - 点击 "Deploy"

#### Vercel 部署配置

创建 `kfc-web/vercel.json`（可选）：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

### 部署到 Netlify

1. **构建项目**

```bash
npm run build
npm run export  # 如果需要静态导出
```

2. **在 Netlify 控制台**
   - 拖拽 `out/` 目录到 Netlify
   - 或连接 GitHub 仓库自动部署

### 部署到传统服务器

#### 使用 PM2 部署

1. **在服务器上安装依赖**

```bash
# 安装 Node.js 和 npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2
```

2. **克隆并构建项目**

```bash
git clone your-repo-url
cd your-repo/kfc-web
npm install --production
npm run build
```

3. **创建 PM2 配置文件**

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'kfc-web',
    script: 'npm',
    args: 'start',
    instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

4. **启动应用**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 使用 Docker 部署

1. **创建 Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **构建和运行容器**

```bash
docker build -t kfc-web .
docker run -p 3000:3000 kfc-web
```

### 环境变量配置

创建 `.env.local` 文件（生产环境）：

```env
# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# 如果有外部API（未来扩展）
# NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
```

### 域名和 HTTPS 配置

#### Vercel 自定义域名

1. 在 Vercel 项目设置中添加自定义域名
2. 配置 DNS 记录指向 Vercel
3. SSL 证书自动配置

#### Nginx 反向代理（自托管）

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 功能说明

### 认证系统
- **登录/注册**: 完整的用户认证流程
- **路由保护**: 未登录用户自动跳转到登录页
- **会话管理**: 登录状态持久化保存

### 主要功能
- **文章卡片**: 点击查看全文，拖放到左侧书架保存
- **书架侧栏**: 保存感兴趣的文章，点击展开进入RAG模式
- **RAG问答**: 嵌入式RAGFlow聊天窗口，黑色主题适配
- **侧栏导航**: 支持在书柜、收藏、热榜、设置之间切换
- **搜索功能**: 顶部搜索框支持搜索文章，自动保存搜索历史
- **浮动导航**: 右下角按钮支持刷新内容和回到顶部

### 用户界面
- **暗色主题**: 黑色背景提供更好的阅读体验
- **动画效果**: 各种交互动画增强用户体验
- **响应式设计**: 适配不同屏幕尺寸
- **用户菜单**: 右上角用户信息和操作菜单

## 🧪 测试

```bash
# 运行测试
npm test

# 运行集成测试
npm run test:integration

# 测试覆盖率
npm run test:coverage
```

## 🐛 故障排除

### 常见构建问题

1. **依赖冲突**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

2. **内存不足**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

3. **TypeScript 错误**
```bash
npx tsc --noEmit
```

### 常见运行时问题

1. **水合错误**
   - 检查组件是否使用了`"use client"`指令
   - 对复杂UI组件使用动态导入并禁用SSR

2. **认证问题**
   - 清除浏览器 localStorage
   - 检查认证状态管理是否正常

3. **样式问题**
   - 确保正确设置Chakra UI主题
   - 避免在Framer Motion动画中直接使用主题变量

### 性能优化

1. **图片优化**
```bash
# 使用 Next.js Image 组件
import Image from 'next/image'
```

2. **代码分割**
```bash
# 动态导入组件
const Component = dynamic(() => import('./Component'), { ssr: false })
```

3. **缓存策略**
```bash
# 配置 next.config.js
module.exports = {
  images: {
    domains: ['your-image-domain.com'],
  },
  experimental: {
    appDir: true,
  }
}
```

## 📞 支持与贡献

### 贡献指南

欢迎贡献代码或提出建议！请遵循以下步骤：

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

### 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 配置
- 编写清晰的提交信息
- 为新功能添加测试

### 问题反馈

如果遇到问题，请：

1. 检查现有的 Issues
2. 提供详细的错误信息和复现步骤
3. 包含系统环境信息（Node.js版本、浏览器等）

## 🗺️ 路线图

- [ ] 真实RAG API集成
- [ ] 更多个性化设置
- [ ] 主题切换功能
- [ ] 移动端应用
- [ ] 数据导入/导出
- [ ] 多语言支持

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🚀 快速部署命令

```bash
# Vercel 一键部署
npm run deploy:vercel

# 构建生产版本
npm run build

# 预览生产版本
npm run start
```

**🎉 享受你的 KnowledgeFlowCompiler 之旅！**

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
