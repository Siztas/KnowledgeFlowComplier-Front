/**
 * API配置模块
 * 定义API基础URL和端点映射
 */

import { API_URL } from '@/utils/env';

// API基础URL，可通过环境变量配置
export const API_BASE_URL = API_URL;

// API端点映射
export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
  },
  articles: {
    list: '/articles',
    detail: (id: string) => `/articles/${id}`,
    search: '/articles/search',
    trending: '/articles/trending',
    create: '/articles',
    update: (id: string) => `/articles/${id}`,
    delete: (id: string) => `/articles/${id}`,
  },
  shelf: {
    list: '/shelf',
    add: '/shelf',
    remove: (id: string) => `/shelf/${id}`,
  },
  favorites: {
    list: '/favorites',
    add: (id: string) => `/favorites/${id}`,
    remove: (id: string) => `/favorites/${id}`,
    status: (id: string) => `/favorites/${id}/status`,
  },
  rag: {
    datasets: '/rag/datasets',
    datasetDetail: (id: string) => `/rag/datasets/${id}`,
    addArticle: (datasetId: string, articleId: string) => 
      `/rag/datasets/${datasetId}/articles/${articleId}`,
    query: '/rag/query',
  },
  settings: {
    get: '/settings',
    update: '/settings',
  }
}; 