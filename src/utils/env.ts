/**
 * 环境配置工具模块
 * 集中管理环境变量，提供默认值
 */

// API基础URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// 是否使用模拟数据
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

// 是否使用模拟服务
export const USE_MOCK_SERVICE = process.env.NEXT_PUBLIC_USE_MOCK_SERVICE !== 'false';

// 是否显示调试信息
export const SHOW_DEBUG_INFO = process.env.NEXT_PUBLIC_SHOW_DEBUG_INFO === 'true';

// 各页面的默认大小
export const DEFAULT_PAGE_SIZE = 10;

// 最大页码数
export const MAX_PAGE_NUMBER = 100;

// 当前环境
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || true;
export const IS_PRODUCTION = process.env.NODE_ENV === 'production' && !IS_DEVELOPMENT;

// 公共图片前缀 - 如果需要使用本地资源文件夹中的图片，可以设置此项
// 例如："http://localhost:3000/" 指向public文件夹
export const PUBLIC_IMAGE_PATH = 'http://localhost:3000/';

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