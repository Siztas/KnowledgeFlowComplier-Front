"use client";

import { 
  Box, 
  Text, 
  Flex, 
  Heading, 
  Spinner, 
  Badge, 
  Image, 
  useColorModeValue,
  IconButton,
  Tooltip
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useArticleStore } from "@/store/articleStore";
import { useEffect } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { processImagePath } from "@/utils/imagePathProcessor";
import EnhancedImage from "./EnhancedImage";

const MotionBox = motion(Box);

const FavoriteArticleList = () => {
  const { 
    favoriteArticles, 
    isLoadingFavorites, 
    favoriteError, 
    loadFavorites,
    removeFromFavorites
  } = useFavoriteStore();
  
  const { setSelectedArticle } = useArticleStore();
  
  // 加载收藏文章
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  
  // 文章卡片背景色
  const cardBg = useColorModeValue("#1a1a1a", "#1a1a1a");
  const cardHoverBg = useColorModeValue("#252525", "#252525");
  
  // 处理文章点击
  const handleArticleClick = (index: number) => {
    const article = favoriteArticles[index];
    setSelectedArticle(article);
  };
  
  // 处理移除收藏
  const handleRemoveFavorite = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation(); // 阻止事件冒泡
    removeFromFavorites(articleId);
  };
  
  // 加载中状态
  if (isLoadingFavorites) {
    return (
      <Flex justify="center" align="center" height="200px" width="100%">
        <Spinner size="lg" color="brand.500" thickness="3px" />
      </Flex>
    );
  }
  
  // 错误状态
  if (favoriteError) {
    return (
      <Box p={4} textAlign="center" color="red.400">
        <Text>加载收藏失败: {favoriteError}</Text>
        <Text 
          mt={2} 
          cursor="pointer" 
          textDecoration="underline" 
          onClick={() => loadFavorites()}
        >
          点击重试
        </Text>
      </Box>
    );
  }
  
  // 空数据状态
  if (favoriteArticles.length === 0) {
    return (
      <Box p={4} textAlign="center" color="whiteAlpha.700">
        <Text>暂无收藏文章</Text>
        <Text mt={2} fontSize="sm">
          浏览文章时，点击收藏按钮将文章添加到此处
        </Text>
      </Box>
    );
  }
  
  return (
    <Box width="100%" px={0}>
      {favoriteArticles.map((article, index) => (
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
          position="relative"
        >
          <Flex align="center">
            {/* 文章信息 */}
            <Box flex="1">
              <Heading size="sm" mb={1} noOfLines={1}>
                {article.title}
              </Heading>
              <Flex fontSize="xs" color="whiteAlpha.700" align="center" flexWrap="wrap">
                {article.authors && article.authors.length > 0 && (
                  <Text mr={2} noOfLines={1}>
                    {article.authors.map(author => author.name).join(', ')}
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
            
            {/* 移除按钮 */}
            <Tooltip label="移除收藏" placement="left">
              <IconButton
                icon={<DeleteIcon />}
                aria-label="移除收藏"
                size="sm"
                variant="ghost"
                colorScheme="red"
                ml={2}
                onClick={(e) => handleRemoveFavorite(e, article.id)}
                _hover={{ bg: "rgba(255, 0, 0, 0.2)" }}
              />
            </Tooltip>
          </Flex>
        </MotionBox>
      ))}
    </Box>
  );
};

export default FavoriteArticleList; 