"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article, SavedArticle } from '@/types/article';

// 示例文章数据
const sampleArticles: Article[] = [
  {
    id: "1",
    title: "深度学习在自然语言处理中的最新进展",
    imageUrl: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=1000",
    content: "深度学习技术在自然语言处理领域取得了显著进展。本文总结了最新的研究成果和应用案例，包括大型语言模型、多模态学习和跨语言迁移学习等方向。"
  },
  {
    id: "2",
    title: "图神经网络在推荐系统中的应用",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    content: "本文探讨了图神经网络如何改进传统的推荐系统。通过建模用户-物品交互的图结构，图神经网络能够捕捉复杂的关系模式，提高推荐准确性和多样性。"
  },
  {
    id: "3",
    title: "强化学习在自动驾驶中的应用挑战",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
    content: "强化学习为自动驾驶技术提供了新的解决方案，但同时也面临着安全性、泛化能力和样本效率等挑战。本文分析了这些挑战并提出了可能的解决思路。"
  },
  {
    id: "4",
    title: "联邦学习：保护隐私的分布式机器学习范式",
    imageUrl: "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?q=80&w=1000",
    content: "联邦学习允许多个参与方在不共享原始数据的情况下共同训练机器学习模型，从而解决了数据隐私保护的问题。本文介绍了联邦学习的基本原理、技术挑战和最新进展。"
  },
  {
    id: "5",
    title: "量子机器学习：未来计算的新前沿",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000",
    content: "量子计算与机器学习的结合开创了量子机器学习这一新兴领域。本文讨论了量子机器学习算法的理论基础、潜在优势以及当前的实验进展。"
  },
  {
    id: "6",
    title: "计算机视觉中的自监督学习",
    imageUrl: "https://images.unsplash.com/photo-1554595666-19ceabf46a84?q=80&w=1000",
    content: "自监督学习通过设计代理任务，使模型能够从未标记的数据中学习有用的表示。本文介绍了计算机视觉领域自监督学习的最新方法和突破。"
  },
  {
    id: "7",
    title: "大规模语言模型的伦理考量",
    imageUrl: "https://images.unsplash.com/photo-1604676453779-3991db910c8c?q=80&w=1000",
    content: "随着GPT等大规模语言模型的广泛应用，其伦理问题日益突出。本文讨论了这些模型在公平性、偏见、隐私和安全等方面的挑战和可能的解决方案。"
  },
];

// 文章状态接口
interface ArticleState {
  articles: Article[];
  savedArticles: SavedArticle[];
  selectedArticle: Article | null;
  searchQuery: string;
  isSearching: boolean;
  searchResults: Article[];
  
  setSelectedArticle: (article: Article | null) => void;
  addToShelf: (article: Article) => void;
  removeFromShelf: (id: string) => void;
  isArticleInShelf: (id: string) => boolean;
  
  // 搜索相关方法
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  searchArticles: (query: string) => void;
  refreshArticles: () => void;
}

// 创建文章状态存储
export const useArticleStore = create<ArticleState>()(
  persist(
    (set, get) => ({
      articles: sampleArticles,
      savedArticles: [],
      selectedArticle: null,
      searchQuery: "",
      isSearching: false,
      searchResults: [],
      
      setSelectedArticle: (article) => set({ selectedArticle: article }),
      
      addToShelf: (article) => {
        const { savedArticles } = get();
        // 检查文章是否已在书架中
        if (!savedArticles.some(saved => saved.id === article.id)) {
          const savedArticle: SavedArticle = {
            id: article.id,
            title: article.title,
            imageUrl: article.imageUrl
          };
          set({ savedArticles: [...savedArticles, savedArticle] });
        }
      },
      
      removeFromShelf: (id) => {
        const { savedArticles } = get();
        set({ savedArticles: savedArticles.filter(article => article.id !== id) });
      },
      
      isArticleInShelf: (id) => {
        const { savedArticles } = get();
        return savedArticles.some(article => article.id === id);
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
      searchArticles: (query) => {
        const { articles } = get();
        set({ isSearching: true, searchQuery: query });
        
        // 简单的客户端搜索实现，实际情况可能需要API调用
        const results = articles.filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) || 
          article.content.toLowerCase().includes(query.toLowerCase())
        );
        
        set({ searchResults: results, isSearching: false });
      },
      
      // 刷新文章
      refreshArticles: () => {
        // 在实际应用中，这里会从API获取新的文章
        // 目前只是模拟刷新效果，随机排序文章
        const { articles } = get();
        const shuffledArticles = [...articles].sort(() => Math.random() - 0.5);
        set({ articles: shuffledArticles });
      }
    }),
    {
      name: 'article-storage', // 持久化存储的名称
      skipHydration: true, // 跳过水合以避免SSR问题
    }
  )
); 