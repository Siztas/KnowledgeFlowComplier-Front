# 模拟数据系统使用指南

本文档介绍如何使用KFC-Web项目的模拟数据系统，该系统允许在无后端的情况下轻松编辑应用中的内容。

## 概述

模拟数据系统包含以下主要组件：

1. `mockData.ts` - 存储所有模拟数据的中央文件
2. `mockApiHandler.ts` - 拦截API请求并返回模拟数据
3. `MockDataEditor.tsx` - 用于在应用内编辑模拟数据的UI组件
4. `mockDataLoader.ts` - 负责从localStorage加载自定义数据
5. `imagePathProcessor.ts` - 处理本地图片路径和远程URL

## 编辑数据的方法

### 方法1：直接在应用中编辑（推荐）

1. 在应用右下角点击"编辑模拟数据"按钮
2. 在弹出的编辑器中修改内容
3. 点击"保存"按钮保存更改
4. 刷新页面查看更改

### 方法2：编辑源文件

1. 打开 `src/utils/mockData.ts` 文件
2. 编辑文件中的数据结构
3. 保存文件并重启应用

## 可编辑的内容

### 1. 文章内容

文章数据位于 `mockArticles` 数组中，每篇文章包含以下字段：

```typescript
{
  id: string;                // 文章ID
  title: string;             // 文章标题
  content: string;           // 文章正文内容
  summary?: string;          // 文章摘要
  authors?: Array<{          // 作者信息
    id: string;
    name: string;
    affiliation?: string;
  }>;
  tags?: string[];           // 标签
  publishedAt?: string;      // 发布日期
  imageUrl?: string;         // 图片URL
  views?: number;            // 浏览量
  citations?: number;        // 引用次数
  popularityScore?: number;  // 热度评分
}
```

### 2. 热榜内容

热榜数据是基于文章数据自动生成的：

- 日榜：根据 `popularityScore` 排序
- 周榜：根据 `views` 排序
- 月榜：根据 `citations` 排序

因此，要修改热榜内容，只需调整这些字段的值。

### 3. RAG问答内容

RAG问答数据位于 `mockRagResponses` 对象中：

- `presetAnswers`：预设问题的回答
- `generateAnswer`：生成动态回答的函数

## 图片路径处理

系统支持三种类型的图片路径：

### 1. 远程URL

直接使用完整的URL，例如：`https://example.com/images/photo.jpg`

### 2. 本地public文件夹图片

支持以下格式的路径：

- 根目录图片：`http://localhost:3000/image.png`
- 子文件夹图片：`http://localhost:3000/papers/1505.05798v1/images/image_2.png`

### 3. 本地文件系统路径

支持Windows和Unix风格的本地文件路径：

- Windows：`C:\path\to\image.jpg`
- Unix：`/path/to/image.jpg`
- 相对路径：`./images/photo.jpg`

### 图片路径处理逻辑

1. 远程URL：直接使用
2. 本地public路径：自动识别子文件夹路径并修正
3. 本地文件系统路径：尝试映射到公共URL，如果无法映射则使用占位图

### 配置公共路径前缀

公共路径前缀用于将本地文件路径映射到可访问的URL：

1. 通过环境变量：`env.ts` 中的 `PUBLIC_IMAGE_PATH`
2. 通过localStorage：在MockDataEditor中的"图片设置"面板设置

例如，设置 `http://localhost:3000/` 作为前缀，则本地路径 `D:\images\photo.jpg` 将被映射为 `http://localhost:3000/images/photo.jpg`。

### 测试图片路径

项目提供了一个专门的测试页面用于验证图片路径处理：

- 访问 `/image-test` 路径
- 使用"运行路径处理测试"按钮查看处理结果
- 查看各种路径的图片渲染效果

## 使用Markdown及公式

文章内容支持Markdown格式和数学公式：

1. 使用标准的Markdown语法添加标题、列表、链接等
2. 使用LaTeX语法添加数学公式，例如：`$E=mc^2$` 或 `$$\nabla \times \vec{B} = \mu_0\vec{J}$$`
3. 使用`![说明](图片URL)`语法添加图片

## 调试信息

要查看详细的调试信息，可以：

1. 在 `env.ts` 中设置 `SHOW_DEBUG_INFO = true`
2. 在 `imagePathProcessor.ts` 中设置 `DEBUG_MODE = true`

这将在浏览器控制台中显示详细的图片路径处理过程。

## 数据持久化

- 在应用内编辑的数据会保存到浏览器的localStorage中
- 保存的数据在浏览器关闭后仍然存在
- 点击"重置所有数据"按钮可以恢复默认数据

## 技术说明

- 模拟数据系统通过 `USE_MOCK_DATA` 环境变量控制是否启用
- 当启用时，apiClient会拦截所有API请求并返回模拟数据
- 自定义数据保存在localStorage中，键名为 `mock_articles` 和 `mock_rag_responses`

如有任何问题，请联系开发团队。