"use client";

import { apiClient } from './apiClient';
import { endpoints } from './apiConfig';
import { API_URL } from '@/utils/env';
import { RagResponse } from '@/types/article';

// RAG数据集接口
export interface RagDataset {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  ragflowDatasetId: string;
  createdAt: string;
  updatedAt: string;
}

// 数据集分页列表响应
export interface RagDatasetListResponse {
  datasets: RagDataset[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 数据集列表查询参数
export interface RagDatasetListParams {
  page?: number;
  pageSize?: number;
}

// 创建数据集参数
export interface CreateDatasetParams {
  name: string;
  description: string;
}

// RAG查询参数
export interface RagQueryParams {
  datasetId: string;
  question: string;
}

/**
 * RAG服务
 * 处理RAG相关API调用
 */
export const ragService = {
  /**
   * 获取数据集列表
   * @param params 查询参数
   * @returns 数据集列表响应
   */
  async getDatasets(params: RagDatasetListParams = {}): Promise<RagDatasetListResponse> {
    return apiClient.get<RagDatasetListResponse>(endpoints.rag.datasets, params);
  },
  
  /**
   * 创建新的数据集
   * @param params 创建参数
   * @returns 创建的数据集
   */
  async createDataset(params: CreateDatasetParams): Promise<RagDataset> {
    return apiClient.post<RagDataset>(endpoints.rag.datasets, params);
  },
  
  /**
   * 获取数据集详情
   * @param datasetId 数据集ID
   * @returns 数据集详情
   */
  async getDatasetById(datasetId: string): Promise<RagDataset> {
    return apiClient.get<RagDataset>(endpoints.rag.datasetDetail(datasetId));
  },
  
  /**
   * 更新数据集
   * @param datasetId 数据集ID
   * @param params 更新参数
   * @returns 更新后的数据集
   */
  async updateDataset(datasetId: string, params: Partial<CreateDatasetParams>): Promise<RagDataset> {
    return apiClient.put<RagDataset>(endpoints.rag.datasetDetail(datasetId), params);
  },
  
  /**
   * 删除数据集
   * @param datasetId 数据集ID
   */
  async deleteDataset(datasetId: string): Promise<void> {
    await apiClient.delete(endpoints.rag.datasetDetail(datasetId));
  },
  
  /**
   * 向数据集添加文章
   * @param datasetId 数据集ID
   * @param articleId 文章ID
   * @returns 更新后的数据集
   */
  async addArticleToDataset(datasetId: string, articleId: string): Promise<RagDataset> {
    return apiClient.post<RagDataset>(endpoints.rag.addArticle(datasetId, articleId));
  },
  
  /**
   * 提交RAG查询（非流式）
   * @param params 查询参数
   * @returns RAG响应
   */
  async query(params: RagQueryParams): Promise<RagResponse> {
    return apiClient.post<RagResponse>(endpoints.rag.query, params);
  },
  
  /**
   * 提交RAG流式查询
   * @param params 查询参数
   * @returns Response对象
   */
  async queryStream(params: RagQueryParams): Promise<Response> {
    const token = localStorage.getItem('auth_token');
    
    return fetch(`${API_URL}${endpoints.rag.query}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        dataset_id: params.datasetId,
        question: params.question
      })
    });
  }
}; 