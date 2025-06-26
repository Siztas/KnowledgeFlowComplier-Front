"use client";

import { Article } from "@/types/article";
import { RagResponse, StreamMessage } from "./ragflowService";
import { mockRagResponses } from "@/utils/mockData";

// Make sure all StreamMessage types have the correct properties
declare module "./ragflowService" {
  interface StreamMessage {
    type: 'token' | 'sources' | 'end' | 'error';
    content?: string;
    sources?: Array<{
      id: string;
      title: string;
      content: string;
      relevance: number;
    }>;
    error?: string;
  }
}

/**
 * 模拟RAGFlow服务
 * 用于开发和测试
 */
export const mockRagflowService = {
  /**
   * 模拟查询响应
   * @param query 用户查询
   * @param articles 书架中的文章
   * @returns 模拟的查询响应
   */
  async submitQuery(query: string, articles: Article[]): Promise<RagResponse> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 如果没有文章，抛出错误
    if (articles.length === 0) {
      throw new Error("书架为空，请先添加文章");
    }
    
    // 使用本地自定义函数生成回答
    const answer = generateMockAnswer(query, articles);
    const sources = mockRagResponses.sourceExtraction(query, articles);
    
    // 构建响应
    return {
      answer,
      sources
    };
  },
  
  /**
   * 模拟流式查询响应
   * @param query 用户查询
   * @param articles 书架中的文章
   * @param onMessage 消息回调函数
   */
  async submitStreamQuery(
    query: string, 
    articles: Article[], 
    onMessage: (message: StreamMessage) => void
  ): Promise<void> {
    // 如果没有文章，返回错误
    if (articles.length === 0) {
      onMessage({ 
        type: 'error', 
        error: '书架为空，请先添加文章' 
      });
      return;
    }
    
    // 使用本地自定义函数生成回答
    const answer = generateMockAnswer(query, articles);
    
    // 模拟流式传输延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟打字效果，每5个字符发送一次更新
    let accumulatedContent = '';
    const updateInterval = 5; // 每5个字符发送一次
    
    for (let i = 0; i < answer.length; i++) {
      // 添加随机延迟模拟打字速度
      await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 80));
      
      // 累积内容
      accumulatedContent += answer[i];
      
      // 每积累updateInterval个字符或到达文本末尾时才发送更新
      if ((i + 1) % updateInterval === 0 || i === answer.length - 1) {
        onMessage({
          type: 'token',
          content: accumulatedContent
        });
      }
    }
    
    // 模拟延迟后发送源文档
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 使用集中管理的模拟数据获取源文档
    const sources = mockRagResponses.sourceExtraction(query, articles);
    
    onMessage({
      type: 'sources',
      sources: sources,
      content: accumulatedContent // 在sources消息中也包含最终的累积内容
    });
    
    // 标记流结束
    await new Promise(resolve => setTimeout(resolve, 200));
    onMessage({ type: 'end' });
  }
};

/**
 * 根据查询和文章生成模拟回答
 * @param query 用户查询
 * @param articles 书架中的文章
 * @returns 模拟回答
 */
function generateMockAnswer(query: string, articles: Article[]): string {
  // 首先检查是否能在mockRagResponses的预设回答中找到匹配
  const lowercaseQuery = query.toLowerCase();
  
  // 检查预设问题是否有匹配
  for (const [keyword, answer] of Object.entries(mockRagResponses.presetAnswers)) {
    if (lowercaseQuery.includes(keyword.toLowerCase())) {
      return answer;
    }
  }
  
  // 如果没有预设回答匹配，则使用基于文章的动态回答
  const articleTitles = articles.map(article => article.title).join("、");
  
  // 根据查询关键词生成不同的回答
  if (lowercaseQuery.includes("什么") || lowercaseQuery.includes("介绍")) {
    return `根据您书架中的文章（${articleTitles}），我可以提供相关概念的介绍。这些文章主要讨论了人工智能领域的最新进展，包括深度学习、神经网络和机器学习应用等方面。具体来说，深度学习是机器学习的一个分支，它使用多层神经网络来模拟人脑的学习过程，能够从大量数据中自动提取特征和模式。`;
  } else if (lowercaseQuery.includes("如何") || lowercaseQuery.includes("怎么")) {
    return `基于您收藏的文章内容，实现这一目标的方法包括：首先，需要明确问题定义和目标；其次，收集和预处理相关数据；然后，选择合适的模型架构并进行训练；最后，评估模型性能并进行必要的优化。在实践中，可能需要迭代多次才能达到满意的结果。`;
  } else if (lowercaseQuery.includes("比较") || lowercaseQuery.includes("区别")) {
    return `从您收藏的文章中可以看出，这些方法各有优缺点。传统方法计算成本低但精度有限；深度学习方法精度高但需要大量数据和计算资源；混合方法则试图结合两者优点。选择哪种方法应根据具体应用场景、可用资源和性能要求来决定。`;
  } else if (lowercaseQuery.includes("未来") || lowercaseQuery.includes("趋势")) {
    return `根据您收藏的研究文章，未来发展趋势可能包括：更高效的模型架构、更少的标注数据需求、更强的跨领域迁移能力，以及更好的可解释性。量子计算和神经形态计算等新兴技术也可能带来突破性进展。同时，隐私保护和伦理问题将越来越受到重视。`;
  } else {
    return `基于您书架中的文章（${articleTitles}），我可以回答您的问题。这些文章主要讨论了人工智能和机器学习领域的最新研究成果和应用案例。您的问题涉及到的内容在这些文章中有所提及，主要观点是人工智能技术正在各个领域取得突破性进展，但同时也面临着数据隐私、算法偏见和计算资源等方面的挑战。`;
  }
} 