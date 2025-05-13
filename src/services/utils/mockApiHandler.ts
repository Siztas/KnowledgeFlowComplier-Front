"use client";

import { Article, ArticleListResponse, TrendingResponse, SearchResultResponse } from '@/types/article';
import { 
  mockArticles, 
  mockTrendingArticles, 
  mockRagResponses, 
  generateMockSearchResults 
} from '@/utils/mockData';
import { RagResponse } from '../ragflowService';

/**
 * 模拟API处理程序
 * 拦截API请求并返回模拟数据
 */
export const mockApiHandler = {
  /**
   * 处理API请求并返回模拟数据
   * @param endpoint API端点
   * @param method HTTP方法
   * @param params 查询参数
   * @param data 请求数据
   * @returns 模拟响应数据
   */
  async handleRequest(
    endpoint: string, 
    method: string = 'GET', 
    params?: any, 
    data?: any
  ): Promise<any> {
    console.log(`[Mock API] ${method} ${endpoint}`, { params, data });
    
    // 添加模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
    
    // 根据端点路径返回相应的模拟数据
    if (endpoint.includes('/articles') && !endpoint.includes('/search') && !endpoint.includes('/trending')) {
      return this.handleArticlesRequest(endpoint, method, params);
    }
    
    if (endpoint.includes('/articles/search')) {
      return this.handleSearchRequest(params);
    }
    
    if (endpoint.includes('/articles/trending')) {
      return this.handleTrendingRequest(params);
    }
    
    if (endpoint.includes('/rag/query')) {
      return this.handleRagQueryRequest(data);
    }
    
    if (endpoint.includes('/favorites')) {
      return this.handleFavoritesRequest(endpoint, method, data);
    }
    
    if (endpoint.includes('/settings')) {
      return this.handleSettingsRequest(endpoint, method, data);
    }
    
    // 默认返回空对象
    return {};
  },
  
  /**
   * 处理文章相关请求
   */
  handleArticlesRequest(endpoint: string, method: string, params?: any): Article | ArticleListResponse {
    // 获取单篇文章
    if (endpoint.match(/\/articles\/[a-zA-Z0-9]+$/)) {
      const id = endpoint.split('/').pop();
      const article = mockArticles.find(a => a.id === id);
      
      if (!article) {
        throw new Error('文章不存在');
      }
      
      return article;
    }
    
    // 文章列表
    const page = params?.page || 1;
    const pageSize = params?.page_size || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      articles: mockArticles.slice(start, end),
      totalCount: mockArticles.length,
      currentPage: page,
      totalPages: Math.ceil(mockArticles.length / pageSize)
    };
  },
  
  /**
   * 处理搜索请求
   */
  handleSearchRequest(params?: any): SearchResultResponse {
    const query = params?.query || '';
    const page = params?.page || 1;
    const pageSize = params?.page_size || 10;
    
    const results = generateMockSearchResults(query);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      results: results.slice(start, end),
      totalCount: results.length,
      currentPage: page,
      totalPages: Math.ceil(results.length / pageSize)
    };
  },
  
  /**
   * 处理热榜请求
   */
  handleTrendingRequest(params?: any): TrendingResponse {
    const period = params?.period || 'week';
    const limit = params?.limit || 10;
    
    return {
      articles: mockTrendingArticles[period as keyof typeof mockTrendingArticles].slice(0, limit)
    };
  },
  
  /**
   * 处理RAG查询请求
   */
  handleRagQueryRequest(data?: any): RagResponse {
    const query = data?.query || '';
    
    // 从书架中获取文章（这里使用mockArticles作为书架文章）
    const shelfArticles = mockArticles.slice(0, Math.min(3, mockArticles.length));
    
    return {
      answer: mockRagResponses.generateAnswer(query),
      sources: mockRagResponses.sourceExtraction(query, shelfArticles)
    };
  },
  
  /**
   * 处理收藏相关请求
   */
  handleFavoritesRequest(endpoint: string, method: string, data?: any): any {
    // 这里使用localStorage来模拟收藏状态
    // 在实际应用中，会由后端管理此状态
    const storageKey = 'mock_favorites';
    let favorites: string[] = [];
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        favorites = JSON.parse(stored);
      }
    }
    
    // 获取收藏列表
    if (method === 'GET') {
      const favoriteArticles = mockArticles
        .filter(article => favorites.includes(article.id))
        .map(article => ({
          id: article.id,
          title: article.title,
          imageUrl: article.imageUrl,
          favoritedAt: new Date().toISOString()
        }));
      
      return { articles: favoriteArticles };
    }
    
    // 添加收藏
    if (method === 'POST') {
      const articleId = data?.article_id;
      if (!favorites.includes(articleId)) {
        favorites.push(articleId);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(favorites));
        }
      }
      
      return { success: true };
    }
    
    // 删除收藏
    if (method === 'DELETE') {
      const articleId = endpoint.split('/').pop();
      favorites = favorites.filter(id => id !== articleId);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(favorites));
      }
      
      return { success: true };
    }
    
    return { success: false };
  },
  
  /**
   * 处理设置相关请求
   */
  handleSettingsRequest(endpoint: string, method: string, data?: any): any {
    // 模拟设置存储
    const storageKey = 'mock_settings';
    let settings = {
      theme: 'dark',
      articleDisplay: 'card',
      notificationsEnabled: true,
      emailNotifications: false,
      language: 'zh-CN',
      articlesPerPage: 20,
      contentPreferences: {
        topics: ['深度学习', '机器学习'],
        excludedTopics: []
      }
    };
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        settings = JSON.parse(stored);
      }
    }
    
    // 获取设置
    if (method === 'GET') {
      return settings;
    }
    
    // 更新设置
    if (method === 'PUT') {
      settings = { ...settings, ...data };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(settings));
      }
      
      return settings;
    }
    
    return settings;
  }
}; 