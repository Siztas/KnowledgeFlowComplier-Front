"use client";

import { apiClient } from './apiClient';
import { endpoints } from './apiConfig';
import { ShelfResponse } from '@/types/article';

/**
 * 书架服务
 * 处理书架相关API调用
 */
export const shelfService = {
  /**
   * 获取用户书架
   * @returns 书架响应
   */
  async getShelf(): Promise<ShelfResponse> {
    return apiClient.get<ShelfResponse>(endpoints.shelf.list);
  },
  
  /**
   * 添加文章到书架
   * @param articleId 文章ID
   * @returns 更新后的书架
   */
  async addToShelf(articleId: string): Promise<ShelfResponse> {
    return apiClient.post<ShelfResponse>(endpoints.shelf.add, { articleId });
  },
  
  /**
   * 从书架中移除文章
   * @param articleId 文章ID
   * @returns 成功响应
   */
  async removeFromShelf(articleId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(endpoints.shelf.remove(articleId));
  }
}; 