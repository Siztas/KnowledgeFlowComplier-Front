/**
 * 环境配置工具模块
 * 集中管理环境变量，提供默认值
 */

// API基础URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// 是否使用模拟数据和服务（开发环境）
// export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || true;
// export const USE_MOCK_SERVICE = process.env.NEXT_PUBLIC_USE_MOCK_SERVICE === 'true' || true;
export const USE_MOCK_DATA = true;
export const USE_MOCK_SERVICE = true;

// 当前环境
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || true;
export const IS_PRODUCTION = process.env.NODE_ENV === 'production' && !IS_DEVELOPMENT;

/**
 * 打印环境配置信息
 */
export const logEnvironment = () => {
  console.log('环境配置:');
  console.log(`- API URL: ${API_URL}`);
  console.log(`- 使用模拟数据: ${USE_MOCK_DATA ? '是' : '否'}`);
  console.log(`- 使用模拟服务: ${USE_MOCK_SERVICE ? '是' : '否'}`);
  console.log(`- 环境: ${IS_DEVELOPMENT ? '开发' : '生产'}`);
}; 