"use client";

import { Box, Flex, Container } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import DndProvider from '@/components/DndProvider';
import { useArticleStore } from '@/store/articleStore';
import Logo from '@/components/Logo';
import DataInitializer from '@/components/DataInitializer';
// import SearchBar from '@/components/SearchBar';

// 使用动态导入，禁用SSR
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const MainContent = dynamic(() => import('@/components/MainContent'), { ssr: false });
const FloatingNav = dynamic(() => import('@/components/FloatingNav'), { ssr: false });
const SearchBar = dynamic(() => import('@/components/SearchBar'), { ssr: false });

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
      {/* 添加数据初始化组件 */}
      <DataInitializer />
      
      <Box position="relative" h="100vh" overflow="hidden" suppressHydrationWarning>
        {/* 主容器 - 添加水平方向的5%边距 */}
        <Container maxW="90%" mx="auto" h="100%" p={0} suppressHydrationWarning>
          {/* 顶部导航区域 */}
          <Flex 
            position="absolute" 
            top={0} 
            left="5%" 
            right="5%"
            zIndex={150}
            p={4}
            align="center"
            justify="space-between"
            width="90%"
            suppressHydrationWarning
          >
            {/* Logo（左上角） */}
            <Logo />
            
            {/* 搜索栏 */}
            <Box width="100%" maxW="600px" mx={4} suppressHydrationWarning>
              <SearchBar 
                onSearch={handleSearch} 
                onClear={clearSearch} 
                isSearching={isSearching} 
              />
            </Box>
            
            {/* 占位，保持布局平衡 */}
            <Box width="40px" visibility="hidden" />
          </Flex>
          
          <Flex h="100vh" overflow="hidden" position="relative" pt={20} pb={4}>
            {/* 左侧书架侧栏 */}
            <Box 
              w="260px" 
              h="100%" 
              bg="sidebar.bg" 
              boxShadow="dark-lg"
              transition="width 0.3s ease"
              position="relative"
              zIndex="100"
              borderRadius="xl"
              overflow="visible"
              mr={4}
              ml={0}
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
              mr={0}
              id="main-content-area"
              className="main-content-area"
              sx={{
                '&::-webkit-scrollbar': {
                  width: '0px',
                  background: 'transparent', 
                  display: 'none'
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* 文章内容 */}
              <MainContent showSearchResults={!!searchQuery} />
            </Box>
          </Flex>
        </Container>
        
        {/* 浮动导航按钮 */}
        <FloatingNav onRefresh={refreshArticles} />
      </Box>
    </DndProvider>
  );
}
