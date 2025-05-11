"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article, ShelfArticle, SearchResult } from '@/types/article';
import { articleService } from '@/services/articleService';
import { shelfService } from '@/services/shelfService';
import { USE_MOCK_DATA } from '@/utils/env';

// 示例文章数据（开发环境使用）
const sampleArticles: Article[] = [
  {
    id: "1",
    title: "深度学习在自然语言处理中的最新进展",
    imageUrl: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=1000",
    content: "深度学习技术在自然语言处理领域取得了显著进展。本文总结了最新的研究成果和应用案例，包括大型语言模型、多模态学习和跨语言迁移学习等方向。近年来，大型语言模型如GPT-4、PaLM和LLaMa系列取得了令人瞩目的突破，它们在语言理解、生成和推理方面展现出前所未有的能力。这些模型依赖于Transformer架构和自监督学习方法，通过在海量文本上进行预训练，习得了丰富的语言知识和世界知识。"
  },
  {
    id: "2",
    title: "图神经网络在推荐系统中的应用",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    content: "本文探讨了图神经网络如何改进传统的推荐系统。通过建模用户-物品交互的图结构，图神经网络能够捕捉复杂的关系模式，提高推荐准确性和多样性。与传统的矩阵分解和协同过滤方法相比，图神经网络可以更有效地利用高阶连接信息，更好地应对数据稀疏性和冷启动问题。此外，图神经网络还能整合异构信息源，如社交网络、知识图谱和上下文信息，进一步提升推荐性能。"
  },
  {
    id: "3",
    title: "强化学习在自动驾驶中的应用挑战",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
    content: "强化学习为自动驾驶技术提供了新的解决方案，但同时也面临着安全性、泛化能力和样本效率等挑战。本文分析了这些挑战并提出了可能的解决思路。自动驾驶系统需要在复杂多变的环境中做出安全可靠的决策，这对强化学习算法提出了极高的要求。如何确保自动驾驶系统能够正确处理极端情况和未见过的场景，是当前研究的重点。此外，强化学习在实际部署中还面临着仿真到现实的迁移问题，以及如何高效利用有限数据进行训练的挑战。"
  },
  {
    id: "4",
    title: "联邦学习：保护隐私的分布式机器学习范式",
    imageUrl: "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?q=80&w=1000",
    content: "联邦学习允许多个参与方在不共享原始数据的情况下共同训练机器学习模型，从而解决了数据隐私保护的问题。本文介绍了联邦学习的基本原理、技术挑战和最新进展。联邦学习的核心思想是'数据不动，模型动'，即模型参数在参与方之间传递和更新，而原始数据则留在本地。这种方式特别适合处理敏感数据，如医疗记录和金融交易。然而，联邦学习也面临着通信效率、系统异构性和模型安全性等挑战，需要进一步的研究和突破。"
  },
  {
    id: "5",
    title: "量子机器学习：未来计算的新前沿",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000",
    content: "量子计算与机器学习的结合开创了量子机器学习这一新兴领域。本文讨论了量子机器学习算法的理论基础、潜在优势以及当前的实验进展。量子计算利用量子力学原理，如叠加和纠缠，有望解决经典计算机难以处理的复杂问题。量子机器学习算法，如量子支持向量机和量子神经网络，理论上可以在特定任务上实现指数级加速。尽管当前的量子硬件仍存在噪声和容错问题，研究人员已经在小规模量子系统上展示了量子机器学习的概念验证。"
  },
  {
    id: "6",
    title: "计算机视觉中的自监督学习",
    imageUrl: "https://images.unsplash.com/photo-1554595666-19ceabf46a84?q=80&w=1000",
    content: "自监督学习通过设计代理任务，使模型能够从未标记的数据中学习有用的表示。本文介绍了计算机视觉领域自监督学习的最新方法和突破。与传统的监督学习方法相比，自监督学习不依赖于大量的人工标注数据，而是利用数据本身的结构信息来生成学习信号。在计算机视觉领域，常见的自监督学习方法包括对比学习、掩码图像建模和自回归预测等。这些方法已经在多种下游任务中取得了接近甚至超过监督学习的性能，展示了自监督学习的巨大潜力。"
  },
  {
    id: "7",
    title: "大规模语言模型的伦理考量",
    imageUrl: "https://images.unsplash.com/photo-1604676453779-3991db910c8c?q=80&w=1000",
    content: "随着GPT等大规模语言模型的广泛应用，其伦理问题日益突出。本文讨论了这些模型在公平性、偏见、隐私和安全等方面的挑战和可能的解决方案。大规模语言模型可能会继承和放大训练数据中的社会偏见，生成具有歧视性或有害的内容。此外，这些模型还可能被滥用于生成虚假信息、钓鱼内容或逃避审查。为了解决这些问题，研究人员提出了多种方法，包括偏见缓解技术、对抗训练、安全对齐以及建立健全的评估框架和监管机制。"
  },
  {
    id: "8",
    title: "人工智能在医疗影像分析中的应用",
    imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1000",
    content: "深度学习技术在医疗影像分析领域展现出巨大潜力，可以辅助医生进行疾病诊断、病变检测和治疗规划。本文介绍了AI在放射学、病理学和眼科学等医学影像领域的最新应用进展。卷积神经网络和Transformer等模型已在X光片、CT、MRI和病理切片等多种医学影像数据上取得了接近或超过人类专家的性能。这些AI系统不仅可以提高诊断准确率，还能减轻医生工作负担，加速诊断流程，特别是在资源有限的地区。然而，临床部署仍面临着数据隐私、模型解释性和监管等挑战。"
  },
  {
    id: "9",
    title: "多智能体强化学习的协作与竞争",
    imageUrl: "https://images.unsplash.com/photo-1582475260298-ee596cfa7b42?q=80&w=1000",
    content: "多智能体强化学习研究如何使多个独立智能体在共享环境中学习最优策略，既可以相互协作，也可以相互竞争。本文分析了多智能体系统中的信用分配、通信协议和均衡学习等关键挑战。在协作设置中，智能体需要协调行动以实现共同目标，而信用分配问题（即确定每个智能体对团队成功的贡献）特别棘手。在竞争设置中，智能体需要学习应对对手的策略，并可能发展出复杂的博弈行为。多智能体强化学习已在游戏、机器人集群、交通管理和市场模拟等领域取得了突破性进展。"
  },
  {
    id: "10",
    title: "神经科学启发的人工智能算法",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000",
    content: "人脑是已知最复杂和高效的信息处理系统，研究人员一直尝试从神经科学中汲取灵感来改进AI算法。本文探讨了神经科学如何启发深度学习、记忆网络和注意力机制的发展。神经科学研究表明，人脑通过分层结构、稀疏编码和注意力机制等机制实现高效信息处理，这些发现已经被应用到人工神经网络的设计中。双向学习系统、神经形态计算和持续学习是当前研究的热点领域，这些方法试图模拟人脑的适应性和能效。尽管如此，我们对人脑工作原理的理解仍然有限，神经科学和AI之间的交叉研究有望带来更多创新。"
  },
];

// 文章状态接口
interface ArticleState {
  // 数据状态
  articles: Article[];
  shelfArticles: ShelfArticle[];
  selectedArticle: Article | null;
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
  setSelectedArticle: (article: Article | null) => void;
  addToShelf: (article: Article) => Promise<void>;
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
      articles: USE_MOCK_DATA ? sampleArticles : [],
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
            // 开发环境：使用示例数据
            await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
            set({ articles: sampleArticles });
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