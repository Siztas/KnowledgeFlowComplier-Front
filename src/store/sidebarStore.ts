"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义侧栏类型
export type SidebarType = 'original' | 'bookshelf' | 'favorites' | 'trending' | 'settings';

// 侧栏状态接口
interface SidebarState {
  // 是否展开（与原来的isExpanded对应）
  isExpanded: boolean;
  // 当前激活的侧栏类型
  activeSidebar: SidebarType;
  // 设置展开状态
  setExpanded: (expanded: boolean) => void;
  // 切换展开状态
  toggleExpand: () => void;
  // 设置激活的侧栏
  setActiveSidebar: (type: SidebarType) => void;
}

// 创建侧栏状态存储
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isExpanded: false,
      activeSidebar: 'original',
      
      setExpanded: (expanded) => set({ isExpanded: expanded }),
      
      toggleExpand: () => {
        const { isExpanded } = get();
        set({ isExpanded: !isExpanded });
      },
      
      setActiveSidebar: (type) => set({ activeSidebar: type }),
    }),
    {
      name: 'sidebar-storage',
      skipHydration: true,
    }
  )
); 