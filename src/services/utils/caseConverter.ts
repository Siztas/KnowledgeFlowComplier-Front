"use client";

/**
 * 转换工具模块
 * 提供snake_case和camelCase之间的转换功能
 */

/**
 * 将字符串从蛇形命名转换为驼峰命名
 * 例如：snake_case -> snakeCase
 */
export function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 将字符串从驼峰命名转换为蛇形命名
 * 例如：camelCase -> camel_case
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * 递归地将对象的所有键从蛇形命名转换为驼峰命名
 */
export function convertKeysToCamelCase<T = any>(obj: any): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase) as any;
  }

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamelCase(key);
      result[camelKey] = convertKeysToCamelCase(obj[key]);
    }
  }
  return result;
}

/**
 * 递归地将对象的所有键从驼峰命名转换为蛇形命名
 */
export function convertKeysToSnakeCase<T = any>(obj: any): T {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = camelToSnakeCase(key);
      result[snakeKey] = convertKeysToSnakeCase(obj[key]);
    }
  }
  return result;
}

/**
 * 规范化数据中的ID字段
 * 有些API可能返回数值型ID，此函数将它们转换为字符串
 * 也会将MongoDB风格的_id字段转换为id
 */
export function normalizeIds<T = any>(obj: any): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizeIds) as any;
  }

  const result: any = { ...obj };
  
  // 将id字段从数值转换为字符串（如果存在且为数值）
  if ('id' in result && typeof result.id === 'number') {
    result.id = String(result.id);
  }
  
  // MongoDB风格的_id转换为id
  if ('_id' in result) {
    result.id = result._id;
    delete result._id;
  }
  
  // 递归处理嵌套对象
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key) && typeof result[key] === 'object' && result[key] !== null) {
      result[key] = normalizeIds(result[key]);
    }
  }
  
  return result;
} 