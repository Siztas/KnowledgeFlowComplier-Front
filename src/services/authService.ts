"use client";

import { apiClient } from './apiClient';
import { endpoints } from './apiConfig';

// 认证响应接口
interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

// 用户注册数据接口
interface RegisterData {
  email: string;
  password: string;
  username: string;
}

// 用户登录数据接口
interface LoginData {
  username: string;
  password: string;
}

// 用户信息接口
export interface UserInfo {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 认证服务
 * 处理用户登录、注册和认证状态
 */
export const authService = {
  /**
   * 注册新用户
   * @param data 注册数据
   * @returns 用户信息
   */
  async register(data: RegisterData): Promise<UserInfo> {
    return apiClient.post<UserInfo>(endpoints.auth.register, data);
  },
  
  /**
   * 用户登录
   * @param data 登录数据
   * @returns 认证响应
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(endpoints.auth.login, data);
    
    // 如果登录成功，设置认证令牌
    if (response && response.accessToken) {
      apiClient.setToken(response.accessToken);
    }
    
    return response;
  },
  
  /**
   * 用户登出
   */
  logout() {
    apiClient.clearToken();
  },
  
  /**
   * 检查用户是否已认证
   * @returns 认证状态
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}; 