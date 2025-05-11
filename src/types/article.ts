/**
 * 文章相关类型定义
 * 与后端API保持一致
 */

// 文章作者接口
export interface Author {
  id: string;
  name: string;
  bio?: string;
}

// 文章引用接口
export interface Reference {
  id: string;
  title: string;
  url: string;
}

// 文章数据接口
export interface Article {
  id: string;
  title: string;
  imageUrl: string; // 后端为image_url
  content: string;
  summary?: string;
  publishedAt?: string; // 后端为published_at
  readingTime?: number; // 后端为reading_time
  views?: number;
  popularityScore?: number; // 后端为popularity_score
  tags?: string[];
  authors?: Author[];
  references?: Reference[];
  createdAt?: string; // 后端为created_at
  updatedAt?: string; // 后端为updated_at
}

// 保存到书架的文章接口
export interface ShelfArticle {
  id: string;
  title: string;
  imageUrl: string;
  savedAt?: string; // 后端为saved_at
}

// 收藏的文章接口
export interface FavoriteArticle {
  id: string;
  title: string;
  imageUrl: string;
  favoritedAt?: string; // 后端为favorited_at
}

// 搜索结果接口
export interface SearchResult {
  id: string;
  title: string;
  imageUrl: string;
  summary?: string;
  publishedAt?: string;
  relevanceScore?: number; // 后端为relevance_score
  tags?: string[];
}

// RAG响应接口
export interface RagResponse {
  answer: string;
  sources: RagSource[];
}

// RAG源文档接口
export interface RagSource {
  id: string;
  title: string;
  content: string;
  relevance: number;
  metadata?: {
    articleId?: string;
    tags?: string[];
  };
}

// 文章分页列表响应
export interface ArticleListResponse {
  articles: Article[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 搜索结果响应
export interface SearchResultResponse {
  results: SearchResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 书架响应
export interface ShelfResponse {
  articles: ShelfArticle[];
}

// 收藏列表响应
export interface FavoritesResponse {
  articles: FavoriteArticle[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 热门文章响应
export interface TrendingResponse {
  articles: Article[];
}

// 收藏状态响应
export interface FavoriteStatusResponse {
  isFavorited: boolean; // 后端为is_favorited
} 