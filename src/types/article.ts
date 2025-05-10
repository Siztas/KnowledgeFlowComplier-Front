// 文章数据接口定义
export interface Article {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
}

// 保存到书架的文章接口定义
export interface SavedArticle {
  id: string;
  title: string;
  imageUrl: string;
} 