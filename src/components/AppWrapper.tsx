"use client";

import { ReactNode, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { loadMockData } from "@/utils/mockDataLoader";
import { MockDataEditorButton } from "./MockDataEditor";
import { USE_MOCK_DATA } from "@/utils/env";
import dynamic from "next/dynamic";

interface AppWrapperProps {
  children: ReactNode;
}

/**
 * 应用包装器组件
 * 负责初始化模拟数据系统并添加模拟数据编辑器按钮
 */
const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  // 初始化模拟数据
  useEffect(() => {
    if (USE_MOCK_DATA) {
      loadMockData();
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