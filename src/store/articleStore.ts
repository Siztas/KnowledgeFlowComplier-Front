"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article, ShelfArticle, SearchResult } from '@/types/article';
import { articleService } from '@/services/articleService';
import { shelfService } from '@/services/shelfService';
import { USE_MOCK_DATA } from '@/utils/env';
import { mockArticles } from '@/utils/mockData';

// 文章状态接口
interface ArticleState {
  // 数据状态
  articles: Article[];
  shelfArticles: ShelfArticle[];
  selectedArticle: Article | SearchResult | null;
  searchQuery: string;
  isSearching: boolean;
  searchResults: SearchResult[];
  
  // 加载状态
  isLoadingArticles: boolean;
  isLoadingShelf: boolean;
  isAddingToShelf: boolean;
  isRemovingFromShelf: boolean;
  
  // 错误状态
  articleError: string | null;
  shelfError: string | null;
  searchError: string | null;
  
  // 文章操作
  setSelectedArticle: (article: Article | SearchResult | null) => void;
  addToShelf: (article: Article | SearchResult) => Promise<void>;
  removeFromShelf: (id: string) => Promise<void>;
  isArticleInShelf: (id: string) => boolean;
  
  // 搜索相关方法
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  searchArticles: (query: string) => Promise<void>;
  
  // 数据加载方法
  loadArticles: () => Promise<void>;
  loadShelf: () => Promise<void>;
  refreshArticles: () => Promise<void>;
}

// 创建文章状态存储
export const useArticleStore = create<ArticleState>()(
  persist(
    (set, get) => ({
      // 初始状态
      articles: USE_MOCK_DATA ? mockArticles : [],
      shelfArticles: [],
      selectedArticle: null,
      searchQuery: "",
      isSearching: false,
      searchResults: [],
      
      // 加载状态
      isLoadingArticles: false,
      isLoadingShelf: false,
      isAddingToShelf: false,
      isRemovingFromShelf: false,
      
      // 错误状态
      articleError: null,
      shelfError: null,
      searchError: null,
      
      // 设置选中文章
      setSelectedArticle: (article) => set({ selectedArticle: article }),
      
      // 添加文章到书架
      addToShelf: async (article) => {
        const { shelfArticles } = get();
        
        // 检查文章是否已在书架中
        if (!shelfArticles.some(saved => saved.id === article.id)) {
          set({ isAddingToShelf: true, shelfError: null });
          
          try {
            if (!USE_MOCK_DATA) {
              // 调用API添加文章到书架
              await shelfService.addToShelf(article.id);
              // 重新加载书架
              await get().loadShelf();
            } else {
              // 开发环境：本地添加
              const savedArticle: ShelfArticle = {
                id: article.id,
                title: article.title,
                imageUrl: article.imageUrl,
                savedAt: new Date().toISOString()
              };
              set({ shelfArticles: [...shelfArticles, savedArticle] });
            }
          } catch (error) {
            console.error('添加文章到书架失败:', error);
            set({ shelfError: error instanceof Error ? error.message : '添加文章到书架失败' });
          } finally {
            set({ isAddingToShelf: false });
          }
        }
      },
      
      // 从书架中移除文章
      removeFromShelf: async (id) => {
        set({ isRemovingFromShelf: true, shelfError: null });
        
        try {
          if (!USE_MOCK_DATA) {
            // 调用API从书架中移除文章
            await shelfService.removeFromShelf(id);
            // 重新加载书架
            await get().loadShelf();
          } else {
            // 开发环境：本地移除
            const { shelfArticles } = get();
            set({ shelfArticles: shelfArticles.filter(article => article.id !== id) });
          }
        } catch (error) {
          console.error('从书架移除文章失败:', error);
          set({ shelfError: error instanceof Error ? error.message : '从书架移除文章失败' });
        } finally {
          set({ isRemovingFromShelf: false });
        }
      },
      
      // 检查文章是否在书架中
      isArticleInShelf: (id) => {
        const { shelfArticles } = get();
        return shelfArticles.some(article => article.id === id);
      },
      
      // 设置搜索查询
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // 清除搜索
      clearSearch: () => set({ 
        searchQuery: "", 
        isSearching: false, 
        searchResults: [] 
      }),
      
      // 执行搜索
      searchArticles: async (query) => {
        set({ isSearching: true, searchQuery: query, searchError: null });
        
        try {
          if (!USE_MOCK_DATA) {
            // 调用API搜索文章
            const response = await articleService.searchArticles({
              query,
              page: 1,
              pageSize: 20
            });
            set({ searchResults: response.results });
          } else {
            // 开发环境：客户端搜索
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟延迟
            
            const { articles } = get();
            // 简单的客户端搜索实现
            const results = articles.filter(article => 
              article.title.toLowerCase().includes(query.toLowerCase()) || 
              article.content.toLowerCase().includes(query.toLowerCase())
            );
            
            // 随机排序结果，使搜索结果看起来更真实
            const sortedResults = [...results].sort((a, b) => {
              // 标题匹配的优先级高于内容匹配
              const titleMatchA = a.title.toLowerCase().includes(query.toLowerCase());
              const titleMatchB = b.title.toLowerCase().includes(query.toLowerCase());
              
              if (titleMatchA && !titleMatchB) return -1;
              if (!titleMatchA && titleMatchB) return 1;
              
              // 如果匹配类型相同，随机排序
              return Math.random() - 0.5;
            });
            
            // 将Article转换为SearchResult
            const searchResults: SearchResult[] = sortedResults.map(article => ({
              id: article.id,
              title: article.title,
              imageUrl: article.imageUrl,
              summary: article.content.substring(0, 150) + '...',
              content: article.content,
              relevanceScore: Math.random() * 0.5 + 0.5, // 模拟0.5-1.0的相关度分数
              tags: article.tags || []
            }));
            
            set({ searchResults });
          }
        } catch (error) {
          console.error('搜索文章失败:', error);
          set({ searchError: error instanceof Error ? error.message : '搜索文章失败' });
        } finally {
          set({ isSearching: false });
        }
      },
      
      // 加载文章列表
      loadArticles: async () => {
        set({ isLoadingArticles: true, articleError: null });
        
        try {
          if (!USE_MOCK_DATA) {
            // 调用API获取文章列表
            const response = await articleService.getArticles({
              page: 1,
              pageSize: 20
            });
            set({ articles: response.articles });
          } else {
            // 开发环境：使用模拟数据
            await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
            set({ articles: mockArticles });
          }
        } catch (error) {
          console.error('加载文章失败:', error);
          set({ articleError: error instanceof Error ? error.message : '加载文章失败' });
        } finally {
          set({ isLoadingArticles: false });
        }
      },
      
      // 加载书架
      loadShelf: async () => {
        set({ isLoadingShelf: true, shelfError: null });
        
        try {
          if (!USE_MOCK_DATA) {
            // 调用API获取书架
            const response = await shelfService.getShelf();
            set({ shelfArticles: response.articles });
          } else {
            // 开发环境：保持当前书架
            // 不做任何操作，因为书架数据是本地存储的
            await new Promise(resolve => setTimeout(resolve, 300)); // 模拟延迟
          }
        } catch (error) {
          console.error('加载书架失败:', error);
          set({ shelfError: error instanceof Error ? error.message : '加载书架失败' });
        } finally {
          set({ isLoadingShelf: false });
        }
      },
      
      // 刷新文章
      refreshArticles: async () => {
        // 更新文章列表
        await get().loadArticles();
      }
    }),
    {
      name: 'article-storage', // 持久化存储的名称
      skipHydration: true, // 跳过水合以避免SSR问题
    }
  )
); 