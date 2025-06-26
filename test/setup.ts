import { JSDOM } from 'jsdom';

// 设置 DOM 环境
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

// 设置全局变量
global.window = dom.window as any;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true
});
global.HTMLElement = dom.window.HTMLElement;

// 模拟 fetch API
import fetch from 'node-fetch';
global.fetch = fetch as any;

// 设置环境变量
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000/api/v1';

// 清理控制台输出（可选）
console.log('Test environment initialized'); 