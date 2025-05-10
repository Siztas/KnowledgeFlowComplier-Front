"use client";

import { Article } from "@/types/article";

// RAGFlow API的响应类型
export interface RagResponse {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    content: string;
    relevance: number;
  }>;
}

// 流式响应的消息类型
export interface StreamMessage {
  type: 'token' | 'sources' | 'error' | 'end';
  content?: string;
  sources?: Array<{
    id: string;
    title: string;
    content: string;
    relevance: number;
  }>;
  error?: string;
}

// RAGFlow服务的基本URL
// 注意：在实际部署时，应该从环境变量获取
const RAGFLOW_API_URL = process.env.NEXT_PUBLIC_RAGFLOW_API_URL || 'http://localhost:8000';

/**
 * RAGFlow服务
 * 提供与RAGFlow API的通信功能
 */
export const ragflowService = {
  /**
   * 向RAGFlow API提交查询
   * @param query 用户查询
   * @param articles 书架中的文章
   * @returns 查询响应
   */
  async submitQuery(query: string, articles: Article[]): Promise<RagResponse> {
    try {
      const response = await fetch(`${RAGFLOW_API_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          documents: articles.map(article => ({
            id: article.id,
            title: article.title,
            content: article.content
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '查询失败');
      }

      return await response.json();
    } catch (error) {
      console.error('RAGFlow API错误:', error);
      throw error;
    }
  },

  /**
   * 向RAGFlow API提交流式查询
   * @param query 用户查询
   * @param articles 书架中的文章
   * @param onMessage 消息回调函数
   */
  async submitStreamQuery(
    query: string, 
    articles: Article[], 
    onMessage: (message: StreamMessage) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${RAGFLOW_API_URL}/api/query/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          documents: articles.map(article => ({
            id: article.id,
            title: article.title,
            content: article.content
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        onMessage({ 
          type: 'error', 
          error: errorData.message || '查询失败' 
        });
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onMessage({ 
          type: 'error', 
          error: '无法读取响应流' 
        });
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onMessage({ type: 'end' });
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // 处理缓冲区中的完整消息
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.trim()) {
            try {
              const message = JSON.parse(line) as StreamMessage;
              onMessage(message);
            } catch (e) {
              console.error('解析消息失败:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('RAGFlow API流式查询错误:', error);
      onMessage({ 
        type: 'error', 
        error: error instanceof Error ? error.message : '未知错误' 
      });
    }
  }
}; 