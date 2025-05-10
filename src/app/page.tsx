"use client";

import { Box, Flex } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import DndProvider from '@/components/DndProvider';

// 使用动态导入，禁用SSR
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const MainContent = dynamic(() => import('@/components/MainContent'), { ssr: false });

export default function Home() {
  return (
    <DndProvider>
      <Flex h="100vh" overflow="hidden" position="relative" p={2}>
        {/* 左侧书架侧栏 */}
        <Box 
          w="300px" 
          h="100%" 
          bg="sidebar.bg" 
          boxShadow="dark-lg"
          transition="width 0.3s ease"
          position="relative"
          zIndex="100" // 提高侧边栏z-index确保始终在顶层
          borderRadius="xl"
          overflow="visible" // 改为visible以确保按钮可见
          mr={3}
        >
          <Sidebar />
        </Box>
        
        {/* 右侧文章卡片流 */}
        <Box 
          flex="1" 
          h="100%" 
          bg="black" 
          p={4} 
          overflow="auto"
          position="relative"
          zIndex="5" // 低于侧边栏
          borderRadius="xl"
          mr={2}
        >
          <MainContent />
        </Box>
      </Flex>
    </DndProvider>
  );
}
