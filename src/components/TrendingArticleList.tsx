"use client";

import { Box, Text, Flex, Heading, Spinner, Badge, Image, useColorModeValue, Stack, IconButton, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useTrendingStore } from "@/store/trendingStore";
import { useArticleStore } from "@/store/articleStore";
import { useEffect } from "react";
import { processImagePath } from "@/utils/imagePathProcessor";
import LocalImage from "./LocalImage";
import { DeleteIcon } from "@chakra-ui/icons";
import EnhancedImage from "./EnhancedImage";

const MotionBox = motion(Box);

const TrendingArticleList = () => {
  const { 
    trendingArticles, 
    isLoadingTrending, 
    trendingError, 
    loadTrendingArticles 
  } = useTrendingStore();
  
  const { setSelectedArticle } = useArticleStore();
  
  // 加载热榜文章
  useEffect(() => {
    loadTrendingArticles();
  }, [loadTrendingArticles]);
  
  // 文章卡片背景色
  const cardBg = useColorModeValue("#1a1a1a", "#1a1a1a");
  const cardHoverBg = useColorModeValue("#252525", "#252525");
  
  // 处理文章点击
  const handleArticleClick = (index: number) => {
    const article = trendingArticles[index];
    setSelectedArticle(article);
  };
  
  // 加载中状态
  if (isLoadingTrending) {
    return (
      <Flex justify="center" align="center" height="200px" width="100%">
        <Spinner size="lg" color="brand.500" thickness="3px" />
      </Flex>
    );
  }
  
  // 错误状态
  if (trendingError) {
    return (
      <Box p={4} textAlign="center" color="red.400">
        <Text>加载热榜失败: {trendingError}</Text>
        <Text 
          mt={2} 
          cursor="pointer" 
          textDecoration="underline" 
          onClick={() => loadTrendingArticles()}
        >
          点击重试
        </Text>
      </Box>
    );
  }
  
  // 空数据状态
  if (trendingArticles.length === 0) {
    return (
      <Box p={4} textAlign="center" color="whiteAlpha.700">
        <Text>暂无热榜数据</Text>
      </Box>
    );
  }
  
  return (
    <Box width="100%" px={0}>
      {trendingArticles.map((article, index) => (
        <MotionBox
          key={article.id}
          mb={3}
          p={3}
          borderRadius="md"
          bg={cardBg}
          cursor="pointer"
          onClick={() => handleArticleClick(index)}
          whileHover={{ 
            backgroundColor: cardHoverBg, 
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Flex align="center">
            {/* 排名 */}
            <Flex 
              justify="center" 
              align="center" 
              minWidth="30px" 
              height="30px" 
              borderRadius="full" 
              bg={index < 3 ? "brand.500" : "whiteAlpha.300"}
              mr={3}
            >
              <Text fontWeight="bold" fontSize="sm">
                {index + 1}
              </Text>
            </Flex>
            
            {/* 文章信息 */}
            <Box flex="1">
              <Heading size="sm" mb={1} noOfLines={1}>
                {article.title}
              </Heading>
              <Flex fontSize="xs" color="whiteAlpha.700" align="center">
                {article.popularityScore && (
                  <Badge colorScheme="green" mr={2} variant="subtle" fontSize="0.6rem">
                    热度 {article.popularityScore.toFixed(1)}
                  </Badge>
                )}
                {article.views && (
                  <Text mr={2}>
                    {article.views} 浏览
                  </Text>
                )}
                {article.publishedAt && (
                  <Text>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Text>
                )}
              </Flex>
            </Box>
            
            {/* 文章图片 */}
            {article.imageUrl && (
              <Box ml={2} width="40px" height="40px" flexShrink={0}>
                <EnhancedImage 
                  src={article.imageUrl} 
                  alt={article.title}
                  displayMode="thumbnail"
                  width="100%"
                  height="100%"
                  borderRadius="md"
                />
              </Box>
            )}
          </Flex>
        </MotionBox>
      ))}
    </Box>
  );
};

export default TrendingArticleList; 