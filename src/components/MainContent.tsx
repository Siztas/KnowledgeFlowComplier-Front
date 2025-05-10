"use client";

import { useState, useRef } from "react";
import { Box, SimpleGrid, Text, Image, Heading, Button, Flex, Badge, Spinner } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useArticleStore } from "@/store/articleStore";
import DraggableArticleCard from "./DraggableArticleCard";
import { Article } from "@/types/article";
import { ChevronLeftIcon, AddIcon, SearchIcon } from "@chakra-ui/icons";

// 动画变体
const variants = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { 
      duration: 0.3,
      ease: "linear"
    }
  },
  fullArticle: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.7, y: 50 },
    transition: { 
      type: "tween",
      duration: 0.35,
      ease: "linear" // 使用线性缓动函数实现直线运动
    }
  }
};

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// 定义组件props
interface MainContentProps {
  showSearchResults?: boolean;
}

const MainContent = ({ showSearchResults = false }: MainContentProps) => {
  const articles = useArticleStore((state) => state.articles);
  const searchResults = useArticleStore((state) => state.searchResults);
  const searchQuery = useArticleStore((state) => state.searchQuery);
  const isSearching = useArticleStore((state) => state.isSearching);
  const selectedArticle = useArticleStore((state) => state.selectedArticle);
  const setSelectedArticle = useArticleStore((state) => state.setSelectedArticle);
  const addToShelf = useArticleStore((state) => state.addToShelf);
  const isArticleInShelf = useArticleStore((state) => state.isArticleInShelf);
  const clearSearch = useArticleStore((state) => state.clearSearch);
  
  // 用于左划的动作值
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0], [0, 1]);
  const scale = useTransform(x, [-200, 0], [0.8, 1]);
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);
  
  // 用于检测点击事件的引用
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 确定要显示的文章列表
  const displayedArticles = showSearchResults ? searchResults : articles;
  
  const handleClose = () => {
    setSelectedArticle(null);
    setIsSwipedLeft(false);
  };
  
  const handleAddToShelf = () => {
    if (selectedArticle) {
      addToShelf(selectedArticle);
    }
  };
  
  // 处理拖动结束
  const handleDragEnd = (event: any, info: any) => {
    // 如果向左滑动超过200px，添加到书架
    if (info.offset.x < -200) {
      setIsSwipedLeft(true);
      if (selectedArticle) {
        addToShelf(selectedArticle);
        
        // 添加短暂延迟后关闭全文视图
        setTimeout(() => {
          setSelectedArticle(null);
          setIsSwipedLeft(false);
        }, 500);
      }
    } else {
      // 如果没有滑动足够距离，重置位置
      x.set(0);
    }
  };
  
  // 处理背景点击事件
  const handleBackdropClick = (e: React.MouseEvent) => {
    // 确保点击的是背景而不是内容
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  // 从搜索结果中突出显示关键词
  const highlightKeywords = (text: string, query: string) => {
    if (!query || !text) return text;
    
    try {
      const parts = text.split(new RegExp(`(${query})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? 
          <Box as="span" key={i} color="brand.300" fontWeight="bold">{part}</Box> : 
          part
      );
    } catch (e) {
      return text;
    }
  };

  return (
    <Box p={2} maxW="100%" overflowX="hidden">
      {/* 搜索结果提示 */}
      {showSearchResults && (
        <MotionFlex
          justify="space-between"
          align="center"
          mb={4}
          px={4}
          py={3}
          bg="#1a1a1a"
          borderRadius="md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "linear" }}
          maxW="100%"
        >
          <Flex align="center" flexWrap="wrap">
            <SearchIcon mr={2} color="brand.400" flexShrink={0} />
            <Text color="white">
              {isSearching ? (
                <Flex align="center">
                  <Spinner size="sm" mr={2} color="brand.400" />
                  正在搜索"{searchQuery}"...
                </Flex>
              ) : searchResults.length > 0 ? (
                <>搜索"{searchQuery}"，找到 <Badge colorScheme="brand" ml={1} mr={1}>{searchResults.length}</Badge> 条结果</>
              ) : (
                <>未找到与"<Box as="span" color="brand.300">{searchQuery}</Box>"相关的文章</>
              )}
            </Text>
          </Flex>
          
          <Button 
            size="sm"
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={clearSearch}
            ml={2}
            flexShrink={0}
          >
            清除搜索
          </Button>
        </MotionFlex>
      )}
      
      {/* 正在搜索状态 */}
      {isSearching && (
        <Flex direction="column" justify="center" align="center" h="50vh">
          <Spinner size="xl" color="brand.500" thickness="4px" speed="0.65s" mb={4} />
          <Heading size="md" color="whiteAlpha.800">正在搜索中</Heading>
          <Text color="whiteAlpha.600" mt={2}>请稍候片刻...</Text>
        </Flex>
      )}
      
      {/* 文章卡片网格 - 5列布局 */}
      {!isSearching && (
        <SimpleGrid 
          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} 
          gap={4} 
          position="relative" 
          zIndex="1"
          justifyItems="center"
          mx="auto"
          maxW="100%"
          sx={{
            '&::-webkit-scrollbar': {
              width: '0px',
              background: 'transparent', 
              display: 'none'
            },
            scrollbarWidth: 'none',
            '-ms-overflow-style': 'none',
          }}
        >
          {displayedArticles.length > 0 ? (
            displayedArticles.map((article) => (
              <MotionBox 
                key={article.id} 
                layoutId={`article-card-${article.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3,
                  ease: "linear"
                }}
                maxW="100%"
                w="100%"
                layout="position"
                layoutDependency={true}
              >
                <DraggableArticleCard article={article} />
              </MotionBox>
            ))
          ) : showSearchResults ? (
            <Box gridColumn="span 5" p={8} textAlign="center" color="whiteAlpha.700">
              <Heading size="md">未找到相关文章</Heading>
              <Text mt={4}>请尝试其他关键词搜索</Text>
              <Button 
                mt={6} 
                colorScheme="brand" 
                leftIcon={<SearchIcon />}
                onClick={clearSearch}
              >
                返回全部文章
              </Button>
            </Box>
          ) : null}
        </SimpleGrid>
      )}

      {/* 文章全文显示 - 模态对话框形式 - 移到最后确保在最上层 */}
      <AnimatePresence mode="wait">
        {selectedArticle && (
          <MotionBox
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.7)" // 更暗的半透明背景
            zIndex="500" // 提高z-index确保在最上层
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleBackdropClick} // 点击背景关闭
            variants={variants.overlay}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <MotionFlex
              ref={contentRef}
              direction="column"
              maxW="900px" // 限制最大宽度
              maxH="90vh" // 限制最大高度
              w={{ base: "95%", md: "90%" }} // 占据屏幕宽度，移动端更大比例
              h="auto" // 高度自适应
              bg="card.bg"
              color="white"
              borderRadius="xl"
              boxShadow="dark-lg"
              overflow="hidden"
              style={{ x, opacity, scale }}
              drag="x"
              dragConstraints={{ left: -300, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()} // 防止点击内容时关闭
              variants={variants.fullArticle}
              initial="initial"
              animate="animate"
              exit="exit"
              layoutId={`article-card-${selectedArticle.id}`} // 添加layoutId用于动画连接
              layoutRoot={true} // 使用layoutRoot替代layout属性
              transformTemplate={(props, transform) => `${transform} translateZ(0)`} // 强制GPU加速和直线变换
            >
              <Flex p={4} justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderColor="whiteAlpha.200">
                <Button leftIcon={<ChevronLeftIcon />} variant="ghost" onClick={handleClose}>
                  返回
                </Button>
                <Button 
                  leftIcon={<AddIcon />} 
                  colorScheme={isArticleInShelf(selectedArticle.id) ? "green" : "brand"}
                  variant={isArticleInShelf(selectedArticle.id) ? "solid" : "outline"}
                  onClick={handleAddToShelf}
                  isDisabled={isArticleInShelf(selectedArticle.id)}
                >
                  {isArticleInShelf(selectedArticle.id) ? "已添加到书架" : "添加到书架"}
                </Button>
              </Flex>
              
              <Box flex="1" p={4} overflow="auto">
                <Box maxW="800px" mx="auto">
                  <motion.div 
                    layoutId={`article-image-${selectedArticle.id}`}
                    transition={{ duration: 0.35, ease: "linear" }}
                  >
                    <Image 
                      src={selectedArticle.imageUrl} 
                      alt={selectedArticle.title}
                      w="100%"
                      h="300px"
                      objectFit="cover"
                      borderRadius="md"
                      mb={6}
                    />
                  </motion.div>
                  
                  <motion.div 
                    layoutId={`article-title-${selectedArticle.id}`}
                    transition={{ duration: 0.35, ease: "linear" }}
                  >
                    <Heading mb={4} color="white" fontSize={{ base: "xl", md: "2xl" }}>
                      {showSearchResults ? highlightKeywords(selectedArticle.title, searchQuery) : selectedArticle.title}
                    </Heading>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, ease: "linear" }}
                  >
                    <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall" color="whiteAlpha.900">
                      {showSearchResults ? highlightKeywords(selectedArticle.content, searchQuery) : selectedArticle.content}
                    </Text>
                  </motion.div>
                </Box>
              </Box>
            </MotionFlex>
            
            {/* 左划提示 */}
            <MotionBox
              position="absolute"
              left={0}
              top="50%"
              transform="translateY(-50%)"
              bg="brand.500"
              color="white"
              p={4}
              borderRightRadius="md"
              initial={{ opacity: 0, x: -100 }}
              animate={{ 
                opacity: x.get() < -50 ? 1 : 0,
                x: x.get() < -50 ? 0 : -100
              }}
              transition={{ duration: 0.2, ease: "linear" }}
            >
              <Flex direction="column" alignItems="center">
                <AddIcon mb={2} />
                <Text>添加到书架</Text>
              </Flex>
            </MotionBox>
            
            {/* 成功添加提示 */}
            {isSwipedLeft && (
              <MotionBox
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="green.500"
                color="white"
                p={6}
                borderRadius="md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "linear" }}
                textAlign="center"
              >
                <Heading size="md">已添加到书架</Heading>
              </MotionBox>
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default MainContent; 