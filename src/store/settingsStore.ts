"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { settingsService, UserSettings } from '@/services/settingsService';
import { USE_MOCK_DATA } from '@/utils/env';

// 默认设置
const defaultSettings: UserSettings = {
  theme: 'dark',
  articleDisplay: 'card',
  notificationsEnabled: true,
  emailNotifications: false,
  language: 'zh-CN',
  articlesPerPage: 20
};

// 设置状态接口
interface SettingsState {
  // 数据状态
  settings: UserSettings;
  
  // 加载状态
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  
  // 错误状态
  settingsError: string | null;
  
  // 操作方法
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

// 创建设置状态存储
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // 初始状态
      settings: defaultSettings,
      
      // 加载状态
      isLoadingSettings: false,
      isUpdatingSettings: false,
      
      // 错误状态
      settingsError: null,
      
      // 加载用户设置
      loadSettings: async () => {
        set({ isLoadingSettings: true, settingsError: null });
        
        try {
          if (!USE_MOCK_DATA) {
            // 调用API获取用户设置
            const settings = await settingsService.getSettings();
            set({ settings });
          } else {
            // 开发环境：使用默认设置或本地存储的设置
            // 不做任何操作，因为设置数据是本地存储的
            await new Promise(resolve => setTimeout(resolve, 300)); // 模拟延迟
          }
        } catch (error) {
          console.error('加载设置失败:', error);
          set({ 
            settingsError: error instanceof Error 
              ? error.message 
              : '加载设置失败' 
          });
        } finally {
          set({ isLoadingSettings: false });
        }
      },
      
      // 更新用户设置
      updateSettings: async (newSettings) => {
        set({ isUpdatingSettings: true, settingsError: null });
        
        try {
          if (!USE_MOCK_DATA) {
            // 调用API更新用户设置
            const updatedSettings = await settingsService.updateSettings(newSettings);
            set({ settings: updatedSettings });
          } else {
            // 开发环境：本地更新设置
            await new Promise(resolve => setTimeout(resolve, 300)); // 模拟延迟
            const { settings } = get();
            set({ settings: { ...settings, ...newSettings } });
          }
        } catch (error) {
          console.error('更新设置失败:', error);
          set({ 
            settingsError: error instanceof Error 
              ? error.message 
              : '更新设置失败' 
          });
        } finally {
          set({ isUpdatingSettings: false });
        }
      },
      
      // 重置设置为默认值
      resetSettings: async () => {
        set({ isUpdatingSettings: true, settingsError: null });
        
        try {
          if (!USE_MOCK_DATA) {
            // 调用API重置用户设置
            await settingsService.updateSettings(defaultSettings);
            set({ settings: defaultSettings });
          } else {
            // 开发环境：本地重置设置
            await new Promise(resolve => setTimeout(resolve, 300)); // 模拟延迟
            set({ settings: defaultSettings });
          }
        } catch (error) {
          console.error('重置设置失败:', error);
          set({ 
            settingsError: error instanceof Error 
              ? error.message 
              : '重置设置失败' 
          });
        } finally {
          set({ isUpdatingSettings: false });
        }
      }
    }),
    {
      name: 'settings-storage', // 持久化存储的名称
      skipHydration: true, // 跳过水合以避免SSR问题
    }
  )
); 