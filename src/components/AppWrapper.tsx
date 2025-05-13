"use client";

import { useEffect } from "react";
import { MockDataEditorButton } from "./MockDataEditor";
import { initMockData } from "@/utils/mockDataLoader";
import { USE_MOCK_DATA } from "@/utils/env";

interface AppWrapperProps {
  children: React.ReactNode;
}

/**
 * 应用包装器组件
 * 负责初始化模拟数据系统并添加模拟数据编辑器按钮
 */
const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  // 初始化模拟数据系统
  useEffect(() => {
    if (USE_MOCK_DATA) {
      initMockData();
    }
  }, []);

  return (
    <>
      {children}
      
      {/* 仅在启用了模拟数据时显示编辑器按钮 */}
      {USE_MOCK_DATA && <MockDataEditorButton />}
    </>
  );
};

export default AppWrapper; 