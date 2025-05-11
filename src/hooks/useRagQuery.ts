"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ragService, RagQueryParams } from "@/services/ragService";
import { Article } from "@/types/article";
import { USE_MOCK_SERVICE } from '@/utils/env';

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
  async queryStream(params: RagQueryParams): Promise<Response> {
    // 模拟流式响应
    const { question } = params;
    
    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 生成模拟回答
        const answer = generateMockAnswer(question);
        
        // 将回答拆分为单词，模拟流式输出
        const words = answer.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          // 模拟打字延迟
          await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 150));
          
          // 发送Token
          const data = {
            text: (i === 0 ? '' : ' ') + words[i],
            finished: false,
            sources: null
          };
          
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
        }
        
        // 发送完整回答后，发送引用源
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 模拟源文档
        const sources = [
          {
            title: "深度学习入门指南",
            content: "深度学习是机器学习的一个分支，它使用多层神经网络来模拟人脑的学习过程。",
            metadata: {
              article_id: "1",
              tags: ["深度学习", "机器学习", "人工智能", "神经网络"]
            }
          },
          {
            title: "人工智能应用案例",
            content: "人工智能技术已经在医疗、金融、教育等领域取得了显著的应用成果。",
            metadata: {
              article_id: "2", 
              tags: ["人工智能", "应用案例"]
            }
          }
        ];
        
        // 发送最终回答和源文档
        const finalData = {
          text: answer,
          finished: true,
          sources
        };
        
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(finalData)}\n\n`));
        controller.close();
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
 * 生成模拟回答
 */
function generateMockAnswer(query: string): string {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes("什么") || lowercaseQuery.includes("介绍")) {
    return "根据您的问题，我可以提供相关概念的介绍。这些文章主要讨论了人工智能领域的最新进展，包括深度学习、神经网络和机器学习应用等方面。具体来说，深度学习是机器学习的一个分支，它使用多层神经网络来模拟人脑的学习过程，能够从大量数据中自动提取特征和模式。";
  } else if (lowercaseQuery.includes("如何") || lowercaseQuery.includes("怎么")) {
    return "基于您的问题，实现这一目标的方法包括：首先，需要明确问题定义和目标；其次，收集和预处理相关数据；然后，选择合适的模型架构并进行训练；最后，评估模型性能并进行必要的优化。在实践中，可能需要迭代多次才能达到满意的结果。";
  } else if (lowercaseQuery.includes("比较") || lowercaseQuery.includes("区别")) {
    return "从收藏的文章中可以看出，这些方法各有优缺点。传统方法计算成本低但精度有限；深度学习方法精度高但需要大量数据和计算资源；混合方法则试图结合两者优点。选择哪种方法应根据具体应用场景、可用资源和性能要求来决定。";
  } else if (lowercaseQuery.includes("未来") || lowercaseQuery.includes("趋势")) {
    return "根据研究文章，未来发展趋势可能包括：更高效的模型架构、更少的标注数据需求、更强的跨领域迁移能力，以及更好的可解释性。量子计算和神经形态计算等新兴技术也可能带来突破性进展。同时，隐私保护和伦理问题将越来越受到重视。";
  } else {
    return "基于您的问题，我可以提供以下信息：人工智能和机器学习领域正在各个领域取得突破性进展，但同时也面临着数据隐私、算法偏见和计算资源等方面的挑战。这些技术正在医疗、金融、教育等领域产生深远影响，改变着我们的生活和工作方式。";
  }
}

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
        ? await mockRagService.queryStream(params)
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
                  id: source.metadata?.article_id || generateId(),
                  title: source.title,
                  content: source.content,
                  relevance: source.metadata?.relevance || 0.9
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