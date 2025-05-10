"use client";

import { Box, Flex } from "@chakra-ui/react";
import dynamic from 'next/dynamic';

// 使用动态导入，禁用SSR
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const MainContent = dynamic(() => import('@/components/MainContent'), { ssr: false });

export default function Home() {
  return (
    <Flex h="100vh" overflow="hidden">
      {/* 左侧书架侧栏 */}
      <Box 
        w="300px" 
        h="100%" 
        bg="white" 
        boxShadow="md"
        transition="width 0.3s ease"
      >
        <Sidebar />
      </Box>
      
      {/* 右侧文章卡片流 */}
      <Box 
        flex="1" 
        h="100%" 
        bg="gray.50" 
        p={4} 
        overflow="auto"
      >
        <MainContent />
      </Box>
    </Flex>
  );
}
