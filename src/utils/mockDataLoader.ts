"use client";

import { mockArticles as defaultArticles, mockTrendingArticles } from './mockData';
import { PUBLIC_IMAGE_PATH } from './env';
import { setPublicImagePrefix } from './imagePathProcessor';

/**
 * 加载模拟数据
 * 从localStorage中加载数据，如果不存在则使用默认值
 */
export function loadMockData() {
  if (typeof window === 'undefined') return;
  
  // 设置公共图片路径前缀
  try {
    const savedPublicPath = localStorage.getItem("mock_public_image_path");
    if (savedPublicPath) {
      setPublicImagePrefix(savedPublicPath);
    } else if (PUBLIC_IMAGE_PATH) {
      setPublicImagePrefix(PUBLIC_IMAGE_PATH);
    }
  } catch (e) {
    console.warn("Failed to load public image path configuration", e);
  }
  
  // 尝试从localStorage加载文章数据
  try {
    const storedArticles = localStorage.getItem('mock_articles');
    if (storedArticles) {
      // 替换默认文章数据
      const parsedArticles = JSON.parse(storedArticles);
      
      // 动态替换默认数组的内容
      defaultArticles.splice(0, defaultArticles.length, ...parsedArticles);
      
      // 更新热榜数据，确保使用最新的文章数据
      try {
        // 重新排序并更新热榜数据
        mockTrendingArticles.day = [...defaultArticles].sort((a, b) => 
          (b.popularityScore || 0) - (a.popularityScore || 0)).slice(0, 3);
        
        mockTrendingArticles.week = [...defaultArticles].sort((a, b) => 
          (b.views || 0) - (a.views || 0)).slice(0, 4);
        
        mockTrendingArticles.month = [...defaultArticles].sort((a, b) => 
          (b.citations || 0) - (a.citations || 0));
      } catch (error) {
        console.error('[Mock Data] 更新热榜数据时出错:', error);
      }
      
      console.log('[Mock Data] 已从localStorage加载自定义文章数据并更新热榜');
    }
    
    // 尝试从localStorage加载RAG回答数据
    const storedRagResponses = localStorage.getItem('mock_rag_responses');
    if (storedRagResponses) {
      try {
        const ragModule = require('./mockData');
        const parsedResponses = JSON.parse(storedRagResponses);
        
        // 替换预设回答
        ragModule.mockRagResponses.presetAnswers = parsedResponses;
        
        console.log('[Mock Data] 已从localStorage加载自定义RAG回答数据');
      } catch (error) {
        console.error('[Mock Data] 替换RAG回答数据时出错:', error);
      }
    }
  } catch (error) {
    console.error('[Mock Data] 加载本地存储数据时出错:', error);
  }
}

/**
 * 初始化模拟数据
 * 在应用启动时调用
 */
export function initMockData() {
  // 确保客户端环境
  if (typeof window !== 'undefined') {
    // 加载自定义数据
    loadMockData();
    
    // 监听storage事件，以便在其他标签页修改数据时更新
    window.addEventListener('storage', (event) => {
      if (event.key === 'mock_articles' || event.key === 'mock_rag_responses') {
        loadMockData();
        // 刷新页面以应用更改
        window.location.reload();
      }
    });
    
    console.log('[Mock Data] 模拟数据系统已初始化');
  }
} 