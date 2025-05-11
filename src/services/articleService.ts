"use client";

import { apiClient } from './apiClient';
import { endpoints } from './apiConfig';
import { 
  Article, 
  ArticleListResponse, 
  SearchResultResponse,
  TrendingResponse 
} from '@/types/article';

// 文章列表查询参数
export interface ArticleListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  tags?: string[];
  authorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// 搜索查询参数
export interface SearchParams extends ArticleListParams {
  query: string;
  readingTimeMin?: number;
  readingTimeMax?: number;
  viewsMin?: number;
  viewsMax?: number;
  exactMatch?: boolean;
}

// 热门文章查询参数
export interface TrendingParams {
  period?: 'day' | 'week' | 'month';
  limit?: number;
}

/**
 * 文章服务
 * 处理文章相关API调用
 */
export const articleService = {
  /**
   * 获取文章列表
   * @param params 查询参数
   * @returns 文章列表响应
   */
  async getArticles(params: ArticleListParams = {}): Promise<ArticleListResponse> {
    return apiClient.get<ArticleListResponse>(endpoints.articles.list, params);
  },
  
  /**
   * 获取文章详情
   * @param id 文章ID
   * @returns 文章详情
   */
  async getArticleById(id: string): Promise<Article> {
    return apiClient.get<Article>(endpoints.articles.detail(id));
  },
  
  /**
   * 搜索文章
   * @param params 搜索参数
   * @returns 搜索结果
   */
  async searchArticles(params: SearchParams): Promise<SearchResultResponse> {
    return apiClient.get<SearchResultResponse>(endpoints.articles.search, params);
  },
  
  /**
   * 获取热门文章
   * @param params 查询参数
   * @returns 热门文章列表
   */
  async getTrendingArticles(params: TrendingParams = {}): Promise<TrendingResponse> {
    return apiClient.get<TrendingResponse>(endpoints.articles.trending, params);
  },
  
  /**
   * 创建文章（需要管理员权限）
   * @param article 文章数据
   * @returns 创建的文章
   */
  async createArticle(article: Partial<Article>): Promise<Article> {
    return apiClient.post<Article>(endpoints.articles.create, article);
  },
  
  /**
   * 更新文章（需要管理员权限）
   * @param id 文章ID
   * @param article 文章数据
   * @returns 更新后的文章
   */
  async updateArticle(id: string, article: Partial<Article>): Promise<Article> {
    return apiClient.put<Article>(endpoints.articles.update(id), article);
  },
  
  /**
   * 删除文章（需要管理员权限）
   * @param id 文章ID
   */
  async deleteArticle(id: string): Promise<void> {
    await apiClient.delete(endpoints.articles.delete(id));
  }
}; 