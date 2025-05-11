"use client";

import { useEffect } from 'react';
import { useArticleStore } from '@/store/articleStore';
import { apiClient } from '@/services/apiClient';
import { API_URL, USE_MOCK_DATA, logEnvironment } from '@/utils/env';

/**
 * 数据初始化组件
 * 在应用加载时初始化数据，并确保API客户端正确配置
 */
const DataInitializer = () => {
  const { loadArticles, loadShelf } = useArticleStore();
  
  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      console.log('初始化应用数据...');
      // 输出环境配置信息
      logEnvironment();
      
      try {
        // 加载文章列表
        await loadArticles();
        
        // 加载书架
        await loadShelf();
        
        console.log('应用数据初始化完成');
      } catch (error) {
        console.error('初始化数据失败:', error);
      }
    };
    
    initializeData();
  }, [loadArticles, loadShelf]);
  
  // 此组件不渲染任何内容
  return null;
};

export default DataInitializer; 