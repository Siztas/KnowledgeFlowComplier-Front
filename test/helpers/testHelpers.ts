import { Article, FavoriteArticle } from '../../src/types/article';

// 创建模拟文章数据
export const createMockArticle = (overrides: Partial<Article> = {}): Article => ({
  id: 'test-article-1',
  title: 'Test Article',
  content: 'This is a test article content.',
  summary: 'This is a test summary.',
  publishedAt: new Date().toISOString(),
  authors: [{ id: '1', name: 'Test Author' }],
  tags: ['test', 'mock'],
  imageUrl: 'test-image.jpg',
  ...overrides
});

// 创建模拟收藏文章数据
export const createMockFavoriteArticle = (overrides: Partial<FavoriteArticle> = {}): FavoriteArticle => ({
  id: 'test-article-1',
  title: 'Test Article',
  imageUrl: 'test-image.jpg',
  favoritedAt: new Date().toISOString(),
  ...overrides
});

// 创建多个模拟文章
export const createMockArticles = (count: number): Article[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockArticle({
      id: `test-article-${index + 1}`,
      title: `Test Article ${index + 1}`,
      content: `This is test article content ${index + 1}.`,
      summary: `This is test summary ${index + 1}.`,
      imageUrl: `test-image-${index + 1}.jpg`
    })
  );
};

// 等待函数（用于异步测试）
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 模拟 API 响应
export const mockApiResponse = <T>(data: T, delay = 0): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

// 模拟 API 错误
export const mockApiError = (message: string, status = 500, delay = 0): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message) as any;
      error.status = status;
      reject(error);
    }, delay);
  });
};

// 测试环境清理工具
export const cleanupTestEnvironment = () => {
  // 清理 localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  
  // 清理 sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
  
  // 重置全局状态（如果需要）
  console.log('Test environment cleaned up');
};

// 验证文章对象结构
export const validateArticleStructure = (article: any): article is Article => {
  return (
    typeof article === 'object' &&
    typeof article.id === 'string' &&
    typeof article.title === 'string' &&
    typeof article.content === 'string' &&
    typeof article.imageUrl === 'string' &&
    (article.summary === undefined || typeof article.summary === 'string') &&
    (article.publishedAt === undefined || typeof article.publishedAt === 'string') &&
    (article.authors === undefined || Array.isArray(article.authors)) &&
    (article.tags === undefined || Array.isArray(article.tags))
  );
};

// 验证收藏文章对象结构
export const validateFavoriteArticleStructure = (article: any): article is FavoriteArticle => {
  return (
    typeof article === 'object' &&
    typeof article.id === 'string' &&
    typeof article.title === 'string' &&
    typeof article.imageUrl === 'string' &&
    (article.favoritedAt === undefined || typeof article.favoritedAt === 'string')
  );
}; 