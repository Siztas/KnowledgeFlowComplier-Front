/**
 * 转换工具模块
 * 提供snake_case和camelCase之间的转换功能
 */

/**
 * 将蛇形命名转换为驼峰命名
 * 例如：user_name -> userName
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * 将驼峰命名转换为蛇形命名
 * 例如：userName -> user_name
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * 递归将对象的键从蛇形命名转换为驼峰命名
 */
export const convertKeysToCamelCase = <T>(obj: any): T => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item)) as unknown as T;
  }

  return Object.keys(obj).reduce((result, key) => {
    const camelKey = snakeToCamel(key);
    result[camelKey] = convertKeysToCamelCase(obj[key]);
    return result;
  }, {} as any) as T;
};

/**
 * 递归将对象的键从驼峰命名转换为蛇形命名
 */
export const convertKeysToSnakeCase = <T>(obj: any): T => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToSnakeCase(item)) as unknown as T;
  }

  return Object.keys(obj).reduce((result, key) => {
    const snakeKey = camelToSnake(key);
    result[snakeKey] = convertKeysToSnakeCase(obj[key]);
    return result;
  }, {} as any) as T;
};

/**
 * 将MongoDB风格的_id字段转换为id
 */
export const normalizeIds = <T>(obj: any): T => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => normalizeIds(item)) as unknown as T;
  }

  const result = { ...obj };
  
  if ('_id' in result) {
    result.id = result._id;
    delete result._id;
  }
  
  // 递归处理嵌套对象
  Object.keys(result).forEach(key => {
    if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = normalizeIds(result[key]);
    }
  });
  
  return result as T;
}; 