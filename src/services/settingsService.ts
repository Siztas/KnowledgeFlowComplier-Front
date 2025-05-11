"use client";

import { apiClient } from './apiClient';
import { endpoints } from './apiConfig';

// 用户设置接口
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  articleDisplay: 'card' | 'list';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  language: string;
  articlesPerPage: number;
  updatedAt?: string;
}

/**
 * 用户设置服务
 * 处理用户设置相关API调用
 */
export const settingsService = {
  /**
   * 获取用户设置
   * @returns 用户设置
   */
  async getSettings(): Promise<UserSettings> {
    return apiClient.get<UserSettings>(endpoints.settings.get);
  },
  
  /**
   * 更新用户设置
   * @param settings 部分设置
   * @returns 更新后的用户设置
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    return apiClient.put<UserSettings>(endpoints.settings.update, settings);
  }
}; 