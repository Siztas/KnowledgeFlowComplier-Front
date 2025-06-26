# KnowledgeFlowCompiler

KnowledgeFlowCompiler是一个网页端的信息流应用，用于论文总结及RAG问答。

## ✨ 主要功能

- 📚 推送论文总结及相关文章
- 🗂️ 允许用户将感兴趣的论文保存到个人集合中（通过拖放或左滑）
- 🤖 基于保存的论文集合进行RAG问答
- 📱 多功能侧栏支持书柜、收藏、研究热榜等不同视图
- 🔍 搜索功能支持关键词高亮和搜索历史
- 🔐 用户认证系统（登录/注册）


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
https://github.com/Siztas/KnowledgeFlowComplier-Front.git
cd KnowledgeFlowComplier-Front
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
# 在项目根目录运行
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
   - 选择 `KnowledgeFlowComplier-Front` 目录作为根目录
   - 点击 "Deploy"

#### Vercel 部署配置

创建 `vercel.json`（可选）：

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
https://github.com/Siztas/KnowledgeFlowComplier-Front.git
cd KnowledgeFlowComplier-Front
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
docker build -t KnowledgeFlowComplier-Front .
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
