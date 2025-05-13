"use client";

import { Box, Heading, Text, Flex, Spinner, useColorModeValue } from "@chakra-ui/react";
import { useTrendingStore } from "@/store/trendingStore";
import { useArticleStore } from "@/store/articleStore";
import { useEffect, useCallback } from "react";
// @ts-ignore
import { Chrono } from "react-chrono";

const TrendingTimeline = () => {
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
  
  // 处理文章点击 - 使用useCallback以避免每次渲染都创建新函数
  const handleArticleClick = useCallback((index: number) => {
    const article = trendingArticles[index];
    setSelectedArticle(article);
  }, [trendingArticles, setSelectedArticle]);
  
  // 准备时间线数据
  const timelineItems = trendingArticles.map(article => {
    // 格式化日期，如果有的话
    const formattedDate = article.publishedAt 
      ? new Date(article.publishedAt).toLocaleDateString() 
      : "未知日期";
    
    return {
      title: formattedDate,
      cardTitle: article.title,
      cardSubtitle: `热度: ${article.popularityScore?.toFixed(1) || 'N/A'} | 浏览: ${article.views || 'N/A'}`,
      cardDetailedText: article.summary || "无摘要信息",
      media: {
        type: "IMAGE",
        source: {
          url: article.imageUrl || "https://via.placeholder.com/300x200"
        }
      }
    };
  });
  
  // 加载中状态
  if (isLoadingTrending) {
    return (
      <Flex justify="center" align="center" height="400px" width="100%">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }
  
  // 错误状态
  if (trendingError) {
    return (
      <Box p={6} textAlign="center" color="red.400">
        <Heading size="md" mb={3}>加载热榜失败</Heading>
        <Text mb={4}>{trendingError}</Text>
        <Text 
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
      <Box p={6} textAlign="center" color="whiteAlpha.700">
        <Heading size="md" mb={3}>暂无热榜数据</Heading>
        <Text>热门研究动态将在这里显示</Text>
      </Box>
    );
  }
  
  return (
    <Box width="100%" height="100%" px={0} overflow="hidden">
      <Heading size="md" mb={6} textAlign="center">
        热门研究时间线
      </Heading>
      
      <Box height="calc(100% - 50px)" width="100%">
        <Chrono
          items={timelineItems}
          mode="VERTICAL"
          cardHeight={200}
          theme={{
            primary: "#3182CE",
            secondary: "#1A1A1A",
            cardBgColor: cardBg,
            cardForeColor: "white",
            titleColor: "white",
            titleColorActive: "#3182CE",
          }}
          onItemSelected={handleArticleClick}
          scrollable={{ scrollbar: true }}
          enableOutline
        />
      </Box>
    </Box>
  );
};

export default TrendingTimeline; 