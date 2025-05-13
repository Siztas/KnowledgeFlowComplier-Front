"use client";

import { Article } from '@/types/article';

/**
 * 集中管理所有模拟数据
 * 可在此处修改数据以快速测试和开发UI
 */

// 扩展 Article 类型以添加 citations 字段
interface ExtendedArticle extends Article {
  citations?: number;
}

// 模拟文章数据
export const mockArticles: ExtendedArticle[] = [
  {
    id: '1',
    title: '深度学习在自然语言处理中的最新进展',
    content: `近年来，深度学习技术在自然语言处理(NLP)领域取得了显著进展。本文介绍了Transformer架构及其变体（如BERT、GPT系列）如何革新了NLP任务处理方式。

这些模型能够捕捉语言中的长距离依赖关系，已在机器翻译、文本摘要、问答系统等多种场景中展现出优异性能。特别是，大规模预训练语言模型能够从海量文本中学习到丰富的语义知识，并通过微调适应下游任务。

未来研究方向包括降低模型计算成本、提高多语言能力、增强跨模态理解等方面。研究人员也在探索如何使模型推理过程更加透明和可解释。`,
    summary: '本文概述了Transformer架构及其在NLP领域的突破性应用，并讨论了大型语言模型的发展方向。',
    authors: [
      { id: '101', name: '张明', bio: '清华大学' },
      { id: '102', name: '李华', bio: '北京人工智能研究院' }
    ],
    tags: ['深度学习', '自然语言处理', 'Transformer', '大型语言模型'],
    publishedAt: '2023-10-15T08:00:00Z',
    imageUrl: 'https://via.placeholder.com/800x400?text=NLP+Advances',
    views: 2453,
    citations: 28,
    popularityScore: 9.6
  },
  {
    id: '2',
    title: '量子计算的实际应用与挑战',
    content: `量子计算正从理论研究走向实际应用。本文深入探讨了量子计算机的工作原理，量子比特的实现方式，以及量子计算面临的去相干性等挑战。

当前，量子计算已在密码学、材料科学和药物发现等领域展现出潜力。例如，Shor算法可以有效分解大整数，威胁现有加密系统；而量子模拟算法可以精确计算复杂分子的性质，加速新材料和药物的开发。

尽管取得了进展，量子计算仍面临硬件稳定性、错误校正、算法设计等多重挑战。研究人员正努力提高量子比特的稳定性和控制精度，开发更强大的量子纠错码，并设计能充分利用量子优势的算法。`,
    summary: '本文探讨了量子计算的基本原理、当前应用场景及其面临的技术挑战。',
    authors: [
      { id: '103', name: '王强', bio: '中国科学院物理研究所' }
    ],
    tags: ['量子计算', '量子算法', '量子纠错', '量子优势'],
    publishedAt: '2023-09-22T10:30:00Z',
    imageUrl: 'https://via.placeholder.com/800x400?text=Quantum+Computing',
    views: 1897,
    citations: 15,
    popularityScore: 8.7
  },
  {
    id: '3',
    title: '机器学习在医学影像诊断中的应用',
    content: `机器学习技术，尤其是深度学习，正在彻底改变医学影像诊断领域。本文综述了卷积神经网络(CNN)在X光片、CT、MRI等医学影像分析中的应用。

研究表明，AI辅助诊断系统在某些疾病检测任务上已达到或超过专业医生水平。例如，深度学习模型在肺结节检测、乳腺癌筛查和眼底疾病诊断等任务上表现出色。这些系统能够处理大量数据，识别人眼难以捕捉的细微模式。

然而，医学AI系统的广泛应用仍面临数据隐私、模型解释性、临床整合等挑战。研究人员正致力于开发可解释的AI模型，确保诊断过程透明且可追溯，同时探索如何将这些系统无缝整合到现有医疗工作流程中。`,
    summary: '本文探讨了深度学习在医学影像领域的应用现状、成功案例及其面临的伦理和实践挑战。',
    authors: [
      { id: '104', name: '刘芳', bio: '上海交通大学医学院' },
      { id: '105', name: '陈明', bio: '复旦大学附属华山医院' }
    ],
    tags: ['机器学习', '医学影像', '卷积神经网络', '辅助诊断'],
    publishedAt: '2023-11-05T14:20:00Z',
    imageUrl: 'https://via.placeholder.com/800x400?text=Medical+Imaging+AI',
    views: 3214,
    citations: 42,
    popularityScore: 9.2
  },
  {
    id: '4',
    title: '图神经网络在推荐系统中的应用',
    content: `图神经网络(GNN)为处理推荐系统中的复杂用户-物品交互关系提供了强大框架。本文详细介绍了GNN如何捕捉用户行为模式并生成个性化推荐。

传统推荐算法往往难以充分挖掘用户与物品之间的高阶连接和结构化信息。而GNN通过消息传递机制，能够利用整个图的连接模式来学习节点表示，从而捕捉更丰富的协同信号和路径依赖特征。

实验结果表明，基于GNN的推荐模型在准确性、多样性和冷启动等多个方面都优于传统方法。文章还讨论了几种主流GNN变体在推荐系统中的适用场景及其优缺点比较。`,
    summary: '本文分析了图神经网络如何革新推荐系统，提高个性化推荐质量和用户满意度。',
    authors: [
      { id: '106', name: '赵莉', bio: '腾讯AI Lab' }
    ],
    tags: ['图神经网络', '推荐系统', '协同过滤', '深度学习'],
    publishedAt: '2023-08-18T09:45:00Z',
    imageUrl: 'https://via.placeholder.com/800x400?text=GNN+Recommender',
    views: 2780,
    citations: 31,
    popularityScore: 8.9
  },
  {
    id: '5',
    title: '强化学习在自动驾驶决策系统中的应用',
    content: `强化学习(RL)为自动驾驶车辆提供了处理复杂交通场景的有效决策框架。本文探讨了RL算法如何使自动驾驶系统学习安全且高效的驾驶策略。

与传统规则基础方法不同，RL可以通过与环境交互不断优化决策过程。研究人员利用深度Q网络(DQN)、近端策略优化(PPO)等算法，训练自动驾驶智能体应对变道、避障、交叉路口通行等复杂场景。

然而，RL在自动驾驶中的应用仍面临样本效率低、仿真到现实迁移困难、安全保障等挑战。文章提出了结合模型引导和模仿学习的混合方法，以及使用形式化验证保障系统安全性的可行途径。`,
    summary: '本文讨论了强化学习在自动驾驶决策系统中的创新应用和关键技术挑战。',
    authors: [
      { id: '107', name: '杨伟', bio: '百度自动驾驶实验室' },
      { id: '108', name: '黄建', bio: '清华大学车辆与运载学院' }
    ],
    tags: ['强化学习', '自动驾驶', '决策系统', '智能交通'],
    publishedAt: '2023-10-30T11:15:00Z',
    imageUrl: 'https://via.placeholder.com/800x400?text=RL+for+Autonomous+Driving',
    views: 1956,
    citations: 24,
    popularityScore: 8.5
  }
];

// 模拟热榜文章数据
export const mockTrendingArticles = {
  day: mockArticles.slice().sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)).slice(0, 3),
  week: mockArticles.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4),
  month: mockArticles.slice().sort((a, b) => (b.citations || 0) - (a.citations || 0))
};

// 模拟RAG问答数据
export const mockRagResponses = {
  // 常见问题的预设回答
  presetAnswers: {
    '深度学习': '深度学习是机器学习的一个分支，它使用多层神经网络来模拟人脑的学习过程，能够从大量数据中自动提取特征和模式。近年来，深度学习在计算机视觉、自然语言处理等领域取得了突破性进展。',
    '量子计算': '量子计算是利用量子力学原理进行信息处理的计算方式，它使用量子比特(qubit)代替经典比特，通过叠加和纠缠等量子现象实现超越经典计算的能力。在特定问题上，量子计算机有望实现指数级加速。',
    '机器学习': '机器学习是人工智能的核心技术之一，它使计算机系统能够从数据中学习规律和模式，而不是显式编程。常见的机器学习方法包括监督学习、无监督学习和强化学习等。'
  },
  
  // 模拟源文档提取
  sourceExtraction: (query: string, articles: Article[]) => {
    // 基于关键词匹配选择最相关的文章作为源
    const lowercaseQuery = query.toLowerCase();
    
    return articles
      .filter(article => {
        const matchTitle = article.title.toLowerCase().includes(lowercaseQuery);
        const matchContent = article.content.toLowerCase().includes(lowercaseQuery);
        const matchTags = article.tags?.some(tag => 
          tag.toLowerCase().includes(lowercaseQuery)
        );
        
        return matchTitle || matchContent || matchTags;
      })
      .slice(0, 2)
      .map((article, index) => ({
        id: article.id,
        title: article.title,
        content: article.content.substring(0, 150) + "...",
        relevance: 0.9 - (index * 0.2) // 模拟相关度
      }));
  },
  
  // 生成回答函数
  generateAnswer: (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    
    // 检查是否匹配预设问题
    for (const [keyword, answer] of Object.entries(mockRagResponses.presetAnswers)) {
      if (lowercaseQuery.includes(keyword.toLowerCase())) {
        return answer;
      }
    }
    
    // 默认回答
    if (lowercaseQuery.includes("什么") || lowercaseQuery.includes("介绍")) {
      return `根据相关文章，这是一种先进的技术方法，主要应用于数据分析和模式识别。它通过复杂的算法和模型架构，能够从大规模数据中提取有价值的信息和规律，为实际问题提供解决方案。`;
    } else if (lowercaseQuery.includes("如何") || lowercaseQuery.includes("怎么")) {
      return `实现这一目标的方法包括：首先，需要明确问题定义和目标；其次，收集和预处理相关数据；然后，选择合适的模型架构并进行训练；最后，评估模型性能并进行必要的优化。在实践中，可能需要迭代多次才能达到满意的结果。`;
    } else if (lowercaseQuery.includes("比较") || lowercaseQuery.includes("区别")) {
      return `这些方法各有优缺点。传统方法计算成本低但精度有限；先进方法精度高但需要大量数据和计算资源；混合方法则试图结合两者优点。选择哪种方法应根据具体应用场景、可用资源和性能要求来决定。`;
    } else {
      return `根据您的问题，我可以提供以下见解：这个领域目前正在快速发展，研究人员提出了多种创新方法来解决相关挑战。虽然取得了显著进展，但仍存在一些待解决的问题，如计算效率、泛化能力和实际部署等。未来研究方向可能包括开发更高效的算法、利用多模态数据和增强模型解释性等。`;
    }
  }
};

// 模拟搜索结果数据
export const generateMockSearchResults = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  
  return mockArticles
    .filter(article => {
      const matchTitle = article.title.toLowerCase().includes(lowercaseQuery);
      const matchContent = article.content.toLowerCase().includes(lowercaseQuery);
      const matchTags = article.tags?.some(tag => 
        tag.toLowerCase().includes(lowercaseQuery)
      );
      
      return matchTitle || matchContent || matchTags;
    })
    .map(article => ({
      ...article,
      relevance: Math.random() * 0.5 + 0.5 // 生成0.5-1.0之间的相关度
    }));
};

/**
 * 使用说明：
 * 
 * 1. 要修改文章内容，直接编辑上方 mockArticles 数组中的对象
 * 2. 要修改热榜内容，可以调整文章的 popularityScore、views 或 citations 值
 * 3. 要自定义RAG回答，编辑 mockRagResponses.presetAnswers 对象或 generateAnswer 函数
 * 4. 所有改动立即生效，无需后端服务
 */ 