 # 模拟数据系统使用指南

本文档介绍如何使用KFC-Web项目的模拟数据系统，该系统允许在无后端的情况下轻松编辑应用中的内容。

## 概述

模拟数据系统包含以下主要组件：

1. `mockData.ts` - 存储所有模拟数据的中央文件
2. `mockApiHandler.ts` - 拦截API请求并返回模拟数据
3. `MockDataEditor.tsx` - 用于在应用内编辑模拟数据的UI组件
4. `mockDataLoader.ts` - 负责从localStorage加载自定义数据

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

- `presetAnswers`: 关键词与回答的映射，当问题包含关键词时返回对应回答
- `generateAnswer`: 生成回答的函数，可以修改函数实现自定义回答逻辑

## 数据持久化

- 在应用内编辑的数据会保存到浏览器的localStorage中
- 保存的数据在浏览器关闭后仍然存在
- 点击"重置所有数据"按钮可以恢复默认数据

## 技术说明

- 模拟数据系统通过 `USE_MOCK_DATA` 环境变量控制是否启用
- 当启用时，apiClient会拦截所有API请求并返回模拟数据
- 自定义数据保存在localStorage中，键名为 `mock_articles` 和 `mock_rag_responses`

如有任何问题，请联系开发团队。