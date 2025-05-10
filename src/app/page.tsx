"use client";

import { Box, Flex } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import DndProvider from '@/components/DndProvider';
import { useArticleStore } from '@/store/articleStore';
import Logo from '@/components/Logo';
import SearchBar from '@/components/SearchBar';

// 使用动态导入，禁用SSR
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const MainContent = dynamic(() => import('@/components/MainContent'), { ssr: false });
const FloatingNav = dynamic(() => import('@/components/FloatingNav'), { ssr: false });

export default function Home() {
  // 获取文章状态
  const { 
    searchQuery, 
    isSearching, 
    searchArticles, 
    clearSearch, 
    refreshArticles 
  } = useArticleStore();
  
  // 处理搜索
  const handleSearch = (query: string) => {
    searchArticles(query);
  };
  
  return (
    <DndProvider>
      <Box position="relative" h="100vh" overflow="hidden">
        {/* Logo（左上角） */}
        <Box position="absolute" top={0} left={0} zIndex={150}>
          <Logo />
        </Box>
        
        <Flex h="100vh" overflow="hidden" position="relative" p={2} pt={16}>
          {/* 左侧书架侧栏 */}
          <Box 
            w="320px" 
            h="100%" 
            bg="sidebar.bg" 
            boxShadow="dark-lg"
            transition="width 0.3s ease"
            position="relative"
            zIndex="100"
            borderRadius="xl"
            overflow="visible"
            mr={3}
          >
            <Sidebar />
          </Box>
          
          {/* 右侧内容区 */}
          <Box 
            flex="1" 
            h="100%" 
            bg="black" 
            p={4} 
            overflow="auto"
            position="relative"
            zIndex="5"
            borderRadius="xl"
            mr={2}
            id="main-content-area"
            className="main-content-area"
          >
            {/* 搜索栏 */}
            <SearchBar 
              onSearch={handleSearch} 
              onClear={clearSearch} 
              isSearching={isSearching} 
            />
            
            {/* 文章内容 */}
            <MainContent showSearchResults={!!searchQuery} />
          </Box>
        </Flex>
        
        {/* 浮动导航按钮 */}
        <FloatingNav onRefresh={refreshArticles} />
      </Box>
    </DndProvider>
  );
}
