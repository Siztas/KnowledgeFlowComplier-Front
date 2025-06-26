"use client";

/**
 * 本地图片服务
 * 用于处理本地图片和远程URL的转换与处理
 */
export const localImageService = {
  /**
   * 检查URL是否为本地路径
   * @param url 图片URL或路径
   * @returns 是否为本地路径
   */
  isLocalPath(url?: string): boolean {
    if (!url) return false;
    
    // 检查是否为绝对路径 (Windows风格 C:\ 或 D:\)
    const isWindowsPath = /^[A-Za-z]:\\/.test(url);
    
    // 检查是否为相对路径 (./images 或 ../images)
    const isRelativePath = url.startsWith('./') || url.startsWith('../');
    
    // 检查是否为绝对路径 (/images)
    const isAbsolutePath = url.startsWith('/') && !url.startsWith('//');
    
    return isWindowsPath || isRelativePath || isAbsolutePath;
  },
  
  /**
   * 获取图片URL
   * 如果是远程URL，直接返回
   * 如果是本地路径，返回占位图片URL
   * @param url 图片URL或路径
   * @returns 可显示的图片URL
   */
  getImageUrl(url?: string): string {
    if (!url) return 'https://via.placeholder.com/400x200?text=No+Image';
    
    if (this.isLocalPath(url)) {
      // 本地路径使用占位图片，但保留文件名信息
      const fileName = url.split(/[\/\\]/).pop() || 'local';
      return `https://via.placeholder.com/400x200?text=Local+Image:+${fileName}`;
    }
    
    return url;
  },
  
  /**
   * 获取图片回退URL (用于图片加载失败时)
   * @returns 回退图片URL
   */
  getFallbackUrl(): string {
    return 'https://via.placeholder.com/400x200?text=Image+Not+Found';
  }
}; 