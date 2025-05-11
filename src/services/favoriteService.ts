"use client";

import { apiClient } from './apiClient';
import { endpoints } from './apiConfig';
import { FavoritesResponse, FavoriteStatusResponse } from '@/types/article';

// 收藏列表查询参数
export interface FavoritesParams {
  page?: number;
  pageSize?: number;
}

/**
 * 收藏服务
 * 处理收藏相关API调用
 */
export const favoriteService = {
  /**
   * 获取收藏列表
   * @param params 查询参数
   * @returns 收藏列表响应
   */
  async getFavorites(params: FavoritesParams = {}): Promise<FavoritesResponse> {
    return apiClient.get<FavoritesResponse>(endpoints.favorites.list, params);
  },
  
  /**
   * 添加收藏
   * @param articleId 文章ID
   * @returns 成功响应
   */
  async addToFavorites(articleId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(
      endpoints.favorites.add(articleId)
    );
  },
  
  /**
   * 取消收藏
   * @param articleId 文章ID
   * @returns 成功响应
   */
  async removeFromFavorites(articleId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(
      endpoints.favorites.remove(articleId)
    );
  },
  
  /**
   * 检查收藏状态
   * @param articleId 文章ID
   * @returns 收藏状态
   */
  async checkFavoriteStatus(articleId: string): Promise<FavoriteStatusResponse> {
    return apiClient.get<FavoriteStatusResponse>(
      endpoints.favorites.status(articleId)
    );
  }
}; 