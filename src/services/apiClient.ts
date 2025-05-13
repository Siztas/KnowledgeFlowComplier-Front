"use client";

import { API_BASE_URL } from './apiConfig';
import { 
  convertKeysToCamelCase, 
  convertKeysToSnakeCase, 
  normalizeIds 
} from './utils/caseConverter';
import { USE_MOCK_DATA } from '@/utils/env';
import { mockApiHandler } from './utils/mockApiHandler';

// 存储令牌的键名
const TOKEN_STORAGE_KEY = 'auth_token';

/**
 * API客户端类
 * 提供统一的API请求处理和认证管理
 */
class ApiClient {
  private token: string | null = null;

  constructor() {
    // 从localStorage或其他存储中恢复token
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  }

  /**
   * 设置认证令牌
   * @param token 认证令牌
   */
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  /**
   * 清除认证令牌
   */
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * 发送API请求
   * @param endpoint API端点
   * @param method HTTP方法
   * @param data 请求数据
   * @param options 请求选项
   * @returns 响应数据
   */
  async request<T = any>(
    endpoint: string, 
    method: string = 'GET', 
    data?: any, 
    options?: RequestInit
  ): Promise<T> {
    // 如果使用模拟数据，使用mockApiHandler处理请求
    if (USE_MOCK_DATA) {
      return mockApiHandler.handleRequest(endpoint, method, null, data) as T;
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    // 设置请求头
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // 添加认证令牌（如果存在）
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    // 构建请求选项
    const requestOptions: RequestInit = {
      method,
      headers,
      ...options,
    };
    
    // 添加请求体（非GET请求）
    if (data && method !== 'GET') {
      // 转换请求数据中的键名（驼峰命名 -> 蛇形命名）
      requestOptions.body = JSON.stringify(convertKeysToSnakeCase(data));
    }
    
    try {
      // 发送请求
      const response = await fetch(url, requestOptions);
      
      // 处理非2xx响应
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '请求失败');
      }
      
      // 处理204 No Content响应
      if (response.status === 204) {
        return null as T;
      }
      
      // 解析响应JSON
      const responseData = await response.json();
      
      // 转换响应数据中的键名（蛇形命名 -> 驼峰命名）并规范化ID
      return normalizeIds(convertKeysToCamelCase<T>(responseData));
    } catch (error) {
      console.error('API请求错误:', error);
      throw error;
    }
  }

  /**
   * 发送GET请求
   * @param endpoint API端点
   * @param params 查询参数
   * @returns 响应数据
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    // 如果使用模拟数据，使用mockApiHandler处理请求
    if (USE_MOCK_DATA) {
      return mockApiHandler.handleRequest(endpoint, 'GET', params) as T;
    }
    
    let url = endpoint;
    
    // 添加查询参数
    if (params) {
      // 转换参数名称为蛇形命名
      const snakeCaseParams = convertKeysToSnakeCase<Record<string, any>>(params);
      const queryString = new URLSearchParams();
      
      // 构建查询字符串
      Object.entries(snakeCaseParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => queryString.append(key, String(item)));
          } else {
            queryString.append(key, String(value));
          }
        }
      });
      
      // 添加查询字符串到URL
      const queryPart = queryString.toString();
      if (queryPart) {
        url = `${url}?${queryPart}`;
      }
    }
    
    return this.request<T>(url);
  }

  /**
   * 发送POST请求
   * @param endpoint API端点
   * @param data 请求数据
   * @returns 响应数据
   */
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, 'POST', data);
  }

  /**
   * 发送PUT请求
   * @param endpoint API端点
   * @param data 请求数据
   * @returns 响应数据
   */
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data);
  }

  /**
   * 发送PATCH请求
   * @param endpoint API端点
   * @param data 请求数据
   * @returns 响应数据
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', data);
  }

  /**
   * 发送DELETE请求
   * @param endpoint API端点
   * @returns 响应数据
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE');
  }
}

// 创建API客户端单例
export const apiClient = new ApiClient(); 