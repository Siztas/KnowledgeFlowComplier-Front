"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article } from '@/types/article';
import { articleService, TrendingParams } from '@/services/articleService';
import { USE_MOCK_DATA } from '@/utils/env';

// 热榜状态接口
interface TrendingState {
  // 数据状态
  trendingArticles: Article[];
  trendingPeriod: 'day' | 'week' | 'month';
  
  // 加载状态
  isLoadingTrending: boolean;
  
  // 错误状态
  trendingError: string | null;
  
  // 操作方法
  loadTrendingArticles: () => Promise<void>;
  setTrendingPeriod: (period: 'day' | 'week' | 'month') => Promise<void>;
  refreshTrending: () => Promise<void>;
}

// 创建热榜状态存储
export const useTrendingStore = create<TrendingState>()(
  persist(
    (set, get) => ({
      // 初始状态
      trendingArticles: [],
      trendingPeriod: 'week', // 默认为周热榜
      
      // 加载状态
      isLoadingTrending: false,
      
      // 错误状态
      trendingError: null,
      
      // 加载热榜文章
      loadTrendingArticles: async () => {
        const { trendingPeriod } = get();
        set({ isLoadingTrending: true, trendingError: null });
        
        try {
          const params: TrendingParams = {
            period: trendingPeriod,
            limit: 20 // 默认加载20篇热门文章
          };
          
          const response = await articleService.getTrendingArticles(params);
          set({ trendingArticles: response.articles });
        } catch (error) {
          console.error('加载热榜文章失败:', error);
          set({ 
            trendingError: error instanceof Error 
              ? error.message 
              : '加载热榜文章失败' 
          });
        } finally {
          set({ isLoadingTrending: false });
        }
      },
      
      // 设置热榜时间范围并重新加载
      setTrendingPeriod: async (period) => {
        set({ trendingPeriod: period });
        await get().loadTrendingArticles();
      },
      
      // 刷新热榜
      refreshTrending: async () => {
        await get().loadTrendingArticles();
      }
    }),
    {
      name: 'trending-storage', // 持久化存储的名称
      skipHydration: true, // 跳过水合以避免SSR问题
    }
  )
); 