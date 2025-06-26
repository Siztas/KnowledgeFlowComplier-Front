"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ragService, RagQueryParams } from "@/services/ragService";
import { Article } from "@/types/article";
import { USE_MOCK_SERVICE } from '@/utils/env';
import { mockRagflowService } from '@/services/mockRagflowService';
import { StreamMessage } from "@/services/ragflowService";

// 消息类型
export type MessageType = 'user' | 'assistant';

// 消息接口
export interface Message {
  id: string;
  type: MessageType;
  content: string;
  isStreaming?: boolean;
  sources?: Array<{
    id: string;
    title: string;
    content: string;
    relevance: number;
  }>;
}

// 错误状态
export interface ErrorState {
  isError: boolean;
  message: string;
}

// 模拟服务（用于开发和测试）
const mockRagService = {
  async queryStream(params: RagQueryParams, articles: Article[]): Promise<Response> {
    // 模拟流式响应
    const { question } = params;
    
    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 使用mockRagflowService生成回答
          await mockRagflowService.submitStreamQuery(
            question, 
            articles,
            (message: StreamMessage) => {
              switch (message.type) {
                case 'token':
                  if (message.content) {
                    const data = {
                      text: message.content, // 直接使用收到的内容，mockRagflowService已经做了累积
                      finished: false,
                      sources: null
                    };
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                  }
                  break;
                  
                case 'sources':
                  if (message.sources) {
                    const finalData = {
                      text: message.content || '', // 使用最后累积的内容
                      finished: true,
                      sources: message.sources
                    };
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(finalData)}\n\n`));
                  }
                  break;
                  
                case 'end':
                  controller.close();
                  break;
                  
                case 'error':
                  throw new Error(message.error);
              }
            }
          );
        } catch (error) {
          console.error('Mock RAG streaming error:', error);
          controller.close();
        }
      }
    });
    
    // 返回模拟的响应对象
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  }
};

/**
 * RAG查询Hook
 * 提供RAG查询功能和状态管理
 */
export const useRagQuery = (articles: Article[]) => {
  // 消息状态
  const [messages, setMessages] = useState<Message[]>([]);
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  // 错误状态
  const [error, setError] = useState<ErrorState>({
    isError: false,
    message: ''
  });

  // 获取最新的RAG数据集ID
  const [datasetId, setDatasetId] = useState<string | null>(null);
  
  // 当前正在流式传输的消息ID
  const currentStreamingMessageId = useRef<string | null>(null);

  // 获取数据集列表
  useEffect(() => {
    // 模拟开发环境下不需要获取实际数据集
    if (USE_MOCK_SERVICE) return;
    
    const fetchDatasets = async () => {
      try {
        const response = await ragService.getDatasets();
        if (response.datasets.length > 0) {
          setDatasetId(response.datasets[0].id);
        }
      } catch (error) {
        console.error('获取数据集失败', error);
      }
    };
    
    fetchDatasets();
  }, []);

  /**
   * 生成唯一ID
   */
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  /**
   * 清空所有消息
   */
  const clearMessages = () => {
    setMessages([]);
    setError({
      isError: false,
      message: ''
    });
  };

  /**
   * 提交查询
   * @param query 用户查询
   */
  const submitQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    // 检查文章是否为空
    if (articles.length === 0) {
      setError({
        isError: true,
        message: '书架为空，请先添加文章到书架'
      });
      return;
    }
    
    // 如果在开发环境下没有数据集，并且不使用模拟服务，则无法继续
    if (!USE_MOCK_SERVICE && !datasetId) {
      setError({
        isError: true,
        message: '未找到RAG数据集，请先创建数据集'
      });
      return;
    }
    
    // 重置错误状态
    setError({
      isError: false,
      message: ''
    });
    
    // 添加用户消息
    const userMessageId = generateId();
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: query
    };
    
    // 创建助手消息（初始为空，将通过流式更新）
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      isStreaming: true
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    currentStreamingMessageId.current = assistantMessageId;
    
    // 设置加载状态
    setIsLoading(true);
    
    try {
      // 准备查询参数
      const params: RagQueryParams = {
        datasetId: datasetId || '0', // 开发环境中使用模拟的数据集ID
        question: query
      };
      
      // 调用流式查询API
      const response = USE_MOCK_SERVICE 
        ? await mockRagService.queryStream(params, articles)
        : await ragService.queryStream(params);
      
      if (!response.ok) {
        throw new Error('查询失败，请稍后再试');
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }
      
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // 标记流结束
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        
        // 处理事件流
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.text !== undefined) {
                // 更新回答内容
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId
                      ? { ...msg, content: data.text }
                      : msg
                  )
                );
              }
              
              if (data.finished && data.sources) {
                // 添加源文档
                const sources = data.sources.map((source: any) => ({
                  id: source.metadata?.article_id || source.id || generateId(),
                  title: source.title,
                  content: source.content,
                  relevance: source.metadata?.relevance || source.relevance || 0.9
                }));
                
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId
                      ? { ...msg, sources }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('解析消息失败:', e);
            }
          }
        }
      }
    } catch (err) {
      setError({
        isError: true,
        message: err instanceof Error ? err.message : '查询失败，请稍后再试'
      });
      
      // 更新消息，标记流结束
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      currentStreamingMessageId.current = null;
    }
  }, [articles, datasetId]);

  return {
    messages,
    isLoading,
    error,
    submitQuery,
    clearMessages,
    hasDataset: !!datasetId || USE_MOCK_SERVICE
  };
}; 