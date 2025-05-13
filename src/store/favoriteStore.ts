"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article, FavoriteArticle } from '@/types/article';
import { favoriteService } from '@/services/favoriteService';
import { articleService } from '@/services/articleService';
import { USE_MOCK_DATA } from '@/utils/env';

// 收藏文章的关系类型
export type FavoriteViewMode = 'graph' | 'timeline';

// 图谱节点类型
export interface GraphNode {
  id: string;
  name: string;
  val: number; // 节点大小
  group?: string; // 节点分组
  articleId?: string; // 关联的文章ID
}

// 图谱连接类型
export interface GraphLink {
  source: string;
  target: string;
  value: number; // 连接强度
  type?: string; // 连接类型
}

// 收藏状态接口
interface FavoriteState {
  // 数据状态
  favoriteArticles: Article[];
  favoriteViewMode: FavoriteViewMode;
  graphData: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
  
  // 加载状态
  isLoadingFavorites: boolean;
  isFavoriting: boolean;
  isUnfavoriting: boolean;
  
  // 错误状态
  favoriteError: string | null;
  
  // 操作方法
  loadFavorites: () => Promise<void>;
  addToFavorites: (articleId: string) => Promise<void>;
  removeFromFavorites: (articleId: string) => Promise<void>;
  checkFavoriteStatus: (articleId: string) => Promise<boolean>;
  setFavoriteViewMode: (mode: FavoriteViewMode) => void;
  generateGraphData: (articles?: Article[]) => void;
}

// 创建收藏状态存储
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      // 初始状态
      favoriteArticles: [],
      favoriteViewMode: 'graph',
      graphData: {
        nodes: [],
        links: []
      },
      
      // 加载状态
      isLoadingFavorites: false,
      isFavoriting: false,
      isUnfavoriting: false,
      
      // 错误状态
      favoriteError: null,
      
      // 加载收藏文章
      loadFavorites: async () => {
        set({ isLoadingFavorites: true, favoriteError: null });
        
        try {
          const response = await favoriteService.getFavorites();
          
          // 将FavoriteArticle转换为Article（这里假设我们需要完整的Article对象）
          // 在实际应用中，可能需要对每个收藏文章调用getArticleById获取完整信息
          const articles: Article[] = response.articles.map(favArticle => ({
            id: favArticle.id,
            title: favArticle.title,
            imageUrl: favArticle.imageUrl,
            content: '',  // 占位，实际应用可能需要获取完整内容
            favoritedAt: favArticle.favoritedAt
          }));
          
          set({ favoriteArticles: articles });
          
          // 生成图谱数据
          get().generateGraphData();
        } catch (error) {
          console.error('加载收藏文章失败:', error);
          set({ 
            favoriteError: error instanceof Error 
              ? error.message 
              : '加载收藏文章失败' 
          });
        } finally {
          set({ isLoadingFavorites: false });
        }
      },
      
      // 添加文章到收藏
      addToFavorites: async (articleId: string) => {
        set({ isFavoriting: true, favoriteError: null });
        
        try {
          await favoriteService.addToFavorites(articleId);
          
          // 获取文章详情并添加到收藏列表
          const article = await articleService.getArticleById(articleId);
          const { favoriteArticles } = get();
          
          set({ 
            favoriteArticles: [...favoriteArticles, article] 
          });
          
          // 更新图谱数据
          get().generateGraphData();
        } catch (error) {
          console.error('添加收藏失败:', error);
          set({ 
            favoriteError: error instanceof Error 
              ? error.message 
              : '添加收藏失败' 
          });
        } finally {
          set({ isFavoriting: false });
        }
      },
      
      // 从收藏中移除文章
      removeFromFavorites: async (articleId: string) => {
        set({ isUnfavoriting: true, favoriteError: null });
        
        try {
          await favoriteService.removeFromFavorites(articleId);
          
          const { favoriteArticles } = get();
          set({ 
            favoriteArticles: favoriteArticles.filter(article => article.id !== articleId) 
          });
          
          // 更新图谱数据
          get().generateGraphData();
        } catch (error) {
          console.error('移除收藏失败:', error);
          set({ 
            favoriteError: error instanceof Error 
              ? error.message 
              : '移除收藏失败' 
          });
        } finally {
          set({ isUnfavoriting: false });
        }
      },
      
      // 检查文章是否已收藏
      checkFavoriteStatus: async (articleId: string) => {
        try {
          const { favoriteArticles } = get();
          
          // 先检查本地状态
          if (favoriteArticles.some(article => article.id === articleId)) {
            return true;
          }
          
          // 如果本地没有，调用API检查
          if (!USE_MOCK_DATA) {
            const response = await favoriteService.checkFavoriteStatus(articleId);
            return response.isFavorited;
          }
          
          return false;
        } catch (error) {
          console.error('检查收藏状态失败:', error);
          return false;
        }
      },
      
      // 设置收藏视图模式
      setFavoriteViewMode: (mode: FavoriteViewMode) => {
        set({ favoriteViewMode: mode });
      },
      
      // 生成图谱数据
      generateGraphData: (articles?: Article[]) => {
        const { favoriteArticles } = get();
        const articlesToUse = articles || favoriteArticles;
        
        if (articlesToUse.length === 0) {
          set({ 
            graphData: { 
              nodes: [], 
              links: [] 
            } 
          });
          return;
        }
        
        // 收集所有作者和引用
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];
        const authorMap = new Map();
        
        // 添加文章节点
        articlesToUse.forEach(article => {
          // 添加文章节点
          nodes.push({
            id: article.id,
            name: article.title,
            val: 20, // 文章节点较大
            group: 'article',
            articleId: article.id
          });
          
          // 添加作者节点和连接
          if (article.authors) {
            article.authors.forEach(author => {
              const authorId = `author-${author.id}`;
              
              // 如果作者节点不存在，添加作者节点
              if (!authorMap.has(authorId)) {
                authorMap.set(authorId, true);
                nodes.push({
                  id: authorId,
                  name: author.name,
                  val: 10, // 作者节点中等大小
                  group: 'author'
                });
              }
              
              // 添加作者与文章的连接
              links.push({
                source: authorId,
                target: article.id,
                value: 1,
                type: 'authored'
              });
            });
          }
          
          // 添加引用连接
          if (article.references) {
            article.references.forEach(ref => {
              // 检查引用的文章是否也在收藏列表中
              const referencedArticle = articlesToUse.find(a => a.id === ref.id);
              
              if (referencedArticle) {
                links.push({
                  source: article.id,
                  target: ref.id,
                  value: 1,
                  type: 'references'
                });
              }
            });
          }
        });
        
        set({ graphData: { nodes, links } });
      }
    }),
    {
      name: 'favorite-storage', // 持久化存储的名称
      skipHydration: true, // 跳过水合以避免SSR问题
    }
  )
);