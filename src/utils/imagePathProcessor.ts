"use client";

/**
 * 处理图片路径
 * 为Web环境下处理图片路径，支持本地路径和远程URL
 */

// 可配置的公共路径前缀 - 开发者可以在全局修改此变量
// 例如设置为：'http://localhost:3000/images/'
export let PUBLIC_IMAGE_PREFIX: string = '';

// 是否启用调试模式，输出图片路径处理信息
const DEBUG_MODE = true;

/**
 * 设置公共图片路径前缀
 * @param prefix 路径前缀
 */
export const setPublicImagePrefix = (prefix: string): void => {
  PUBLIC_IMAGE_PREFIX = prefix.endsWith('/') ? prefix : prefix + '/';
};

/**
 * 检查是否为本地文件路径
 * @param path 可能的文件路径
 * @returns 是否为本地文件路径
 */
export const isLocalPath = (path?: string): boolean => {
  if (!path) return false;
  
  // 检查常见的本地路径格式
  return (
    /^[A-Za-z]:\\/.test(path) ||  // Windows路径 C:\path\to\file.jpg
    path.startsWith('/') ||       // Unix绝对路径 /path/to/file.jpg  
    path.startsWith('./') ||      // 相对路径 ./path/to/file.jpg
    path.startsWith('../')        // 父级相对路径 ../path/to/file.jpg
  );
};

/**
 * 尝试将本地路径转换为公共URL
 * 如果设置了PUBLIC_IMAGE_PREFIX，则将本地路径转换为URL
 * @param path 本地路径
 * @returns 如果可能，返回公共URL；否则返回null
 */
export const tryMapToPublicUrl = (path: string): string | null => {
  if (!PUBLIC_IMAGE_PREFIX) {
    return null;
  }
  
  // 处理路径中的子文件夹
  let relativePath;
  
  if (path.includes('/') || path.includes('\\')) {
    // 检查是否有特定模式的子文件夹路径
    const windowsMatch = path.match(/[A-Za-z]:\\(.+)/);
    const unixMatch = path.match(/\/(.+)/);
    const relativeMatch = path.match(/\.\.?\/(.+)/);
    
    if (windowsMatch) {
      // 处理Windows路径，提取从盘符之后的部分
      relativePath = windowsMatch[1].replace(/\\/g, '/');
    } else if (unixMatch) {
      // 处理Unix绝对路径，提取根目录之后的部分
      relativePath = unixMatch[1];
    } else if (relativeMatch) {
      // 处理相对路径，提取./或../之后的部分
      relativePath = relativeMatch[1];
    } else {
      // 作为备选，尝试直接从最后一个斜杠分割
      const parts = path.split(/[\/\\]/);
      const fileName = parts.pop() || '';
      const folderPath = parts.pop();
      
      // 如果有文件夹和文件名，组合它们
      if (folderPath) {
        relativePath = `${folderPath}/${fileName}`;
      } else {
        relativePath = fileName;
      }
    }
  } else {
    // 没有子文件夹，只是文件名
    relativePath = path;
  }
  
  // 确保去除前导斜杠
  relativePath = relativePath.replace(/^[\/\\]+/, '');
  
  // 返回带前缀的URL
  return `${PUBLIC_IMAGE_PREFIX}${relativePath}`;
};

/**
 * 从路径中提取文件名
 * @param path 文件路径
 * @returns 文件名
 */
export const extractFilename = (path: string): string => {
  return path.split(/[\/\\]/).pop() || 'file';
};

/**
 * 生成随机颜色作为占位图背景
 * @returns 十六进制颜色代码
 */
const generateRandomColor = (): string => {
  // 使用暗色调的颜色，适合作为背景
  const colors = [
    '4A5568', '2D3748', '1A202C', // 灰色系
    '3182CE', '2B6CB0', '2C5282', // 蓝色系
    '38A169', '2F855A', '276749', // 绿色系
    '9F7AEA', '805AD5', '6B46C1', // 紫色系
    'ED8936', 'DD6B20', 'C05621', // 橙色系
    'E53E3E', 'C53030', '9B2C2C', // 红色系
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 检查路径是否指向public文件夹内的子文件夹
 * @param path 图片路径
 * @returns 处理后的路径
 */
const checkSubfolderPath = (path: string): string => {
  // 检查是否有指向子文件夹但缺少papers前缀的路径模式
  const subfolderPattern = /^https?:\/\/[^\/]+\/([^\/]+)\/images\//;
  const match = path.match(subfolderPattern);
  
  if (match && match[1] && !path.includes('/papers/')) {
    // 发现是子文件夹路径但缺少papers目录，添加papers前缀
    const subfolder = match[1];
    const newPath = path.replace(`/${subfolder}/images/`, `/papers/${subfolder}/images/`);
    if (DEBUG_MODE) console.log(`[ImageProcessor] 修复子文件夹路径: ${path} -> ${newPath}`);
    return newPath;
  }
  
  return path;
};

/**
 * 为Web环境处理图片路径
 * - 如果是远程URL，直接返回
 * - 如果是本地路径，尝试映射到公共URL，否则返回占位图
 * 
 * @param path 图片路径
 * @param width 图片宽度
 * @param height 图片高度
 * @returns Web可用的图片URL
 */
export const processImagePath = (path?: string, width = 400, height = 200): string => {
  if (!path) {
    return `https://via.placeholder.com/${width}x${height}?text=No+Image`; 
  }
  
  // 如果不是本地路径(即是有效URL)，检查子文件夹路径
  if (!isLocalPath(path)) {
    // 检查并修复子文件夹路径
    const correctedPath = checkSubfolderPath(path);
    if (DEBUG_MODE && correctedPath !== path) {
      console.log(`[ImageProcessor] 已修复子文件夹路径: ${path} -> ${correctedPath}`);
    } else if (DEBUG_MODE) {
      console.log(`[ImageProcessor] 使用远程URL: ${path}`);
    }
    return correctedPath;
  }
  
  // 尝试映射到公共URL
  const publicUrl = tryMapToPublicUrl(path);
  if (publicUrl) {
    // 检查并修复子文件夹路径
    const correctedUrl = checkSubfolderPath(publicUrl);
    if (DEBUG_MODE) {
      if (correctedUrl !== publicUrl) {
        console.log(`[ImageProcessor] 本地路径映射并修复: ${path} -> ${correctedUrl}`);
      } else {
        console.log(`[ImageProcessor] 本地路径映射: ${path} -> ${publicUrl}`);
      }
    }
    return correctedUrl;
  }

  if (DEBUG_MODE) console.log(`[ImageProcessor] 本地路径使用占位图: ${path}`);
  
  // 对于本地路径，生成一个包含文件名的占位图
  const filename = extractFilename(path);
  const fileExtension = filename.split('.').pop() || '';
  const displayName = filename.length > 20 ? filename.substring(0, 17) + '...' : filename;
  const color = generateRandomColor();
  
  // 提取文件扩展名并判断是否为图片
  const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'];
  const isImageFile = imageExts.includes(fileExtension.toLowerCase());
  
  // 针对不同大小优化显示内容
  if (width < 60 || height < 60) {
    // 小尺寸只显示图标
    return `https://via.placeholder.com/${width}x${height}/${color}/FFFFFF?text=IMG`;
  } else if (width < 150 || height < 150) {
    // 中等尺寸显示简短信息
    const text = isImageFile ? 'Image' : 'File';
    return `https://via.placeholder.com/${width}x${height}/${color}/FFFFFF?text=${text}`;
  } else {
    // 大尺寸显示完整信息
    const fileType = isImageFile ? 'Local Image' : 'Local File';
    return `https://via.placeholder.com/${width}x${height}/${color}/FFFFFF?text=${fileType}:+${displayName}`;
  }
}; 