"use client";

import { useState, useCallback, useRef } from "react";
import { ragflowService, StreamMessage } from "@/services/ragflowService";
import { mockRagflowService } from "@/services/mockRagflowService";
import { Article } from "@/types/article";

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

// 使用模拟服务还是真实服务
// 注意：在实际部署时，应该从环境变量获取
const USE_MOCK_SERVICE = true;

// 选择要使用的服务
const service = USE_MOCK_SERVICE ? mockRagflowService : ragflowService;

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

  // 当前正在流式传输的消息ID
  const currentStreamingMessageId = useRef<string | null>(null);

  /**
   * 生成唯一ID
   */
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
      // 调用流式API
      await service.submitStreamQuery(
        query,
        articles,
        handleStreamMessage
      );
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
  }, [articles]);

  /**
   * 处理流式消息
   * @param message 流式消息
   */
  const handleStreamMessage = useCallback((message: StreamMessage) => {
    const messageId = currentStreamingMessageId.current;
    
    if (!messageId) return;
    
    switch (message.type) {
      case 'token':
        // 添加新token到当前消息
        if (message.content) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId
                ? { ...msg, content: msg.content + message.content }
                : msg
            )
          );
        }
        break;
        
      case 'sources':
        // 添加源文档到当前消息
        if (message.sources) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId
                ? { ...msg, sources: message.sources }
                : msg
            )
          );
        }
        break;
        
      case 'error':
        // 处理错误
        setError({
          isError: true,
          message: message.error || '查询失败，请稍后再试'
        });
        
        // 更新消息，标记流结束
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        break;
        
      case 'end':
        // 标记流结束
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        break;
    }
  }, []);

  /**
   * 清空消息
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    submitQuery,
    clearMessages
  };
}; 