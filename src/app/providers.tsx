"use client";

import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import { useArticleStore } from "@/store/articleStore";

// 创建自定义主题
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export function Providers({ children }: { children: ReactNode }) {
  // 客户端运行时清除可能导致水合错误的属性
  useEffect(() => {
    // 移除html元素上可能导致水合错误的属性
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
  }, []);

  // 初始化Zustand持久化存储
  useEffect(() => {
    // 触发Zustand的持久化存储加载
    const state = useArticleStore.getState();
    useArticleStore.persist.rehydrate();
  }, []);

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme} resetCSS={false} disableGlobalStyle>
        {children}
      </ChakraProvider>
    </>
  );
} 