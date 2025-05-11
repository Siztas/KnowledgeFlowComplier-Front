"use client";

import { Box, Heading, Flex, ButtonGroup, Button, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useTrendingStore } from "@/store/trendingStore";
import { useSidebarStore } from "@/store/sidebarStore";
import TrendingArticleList from "./TrendingArticleList";

const MotionButton = motion(Button);
const MotionBox = motion(Box);

// 返回按钮组件
const BackButton = ({ onClick }: { onClick: () => void }) => (
  <MotionBox
    position="absolute"
    top="10px"
    left="50%"
    transform="translateX(-50%)"
    width="50px"
    height="5px"
    bg="#333"
    borderRadius="full"
    cursor="pointer"
    onClick={onClick}
    whileHover={{ scale: 1.2, backgroundColor: "#555" }}
    whileTap={{ scale: 0.9 }}
    zIndex={300}
  />
);

const TrendingContent = () => {
  const { setActiveSidebar } = useSidebarStore();
  const { trendingPeriod, setTrendingPeriod } = useTrendingStore();
  
  // 按钮颜色
  const activeBg = useColorModeValue("brand.500", "brand.500");
  const inactiveBg = useColorModeValue("#1a1a1a", "#1a1a1a");
  
  return (
    <Flex direction="column" width="100%" height="100%" align="center" px={0}>
      <BackButton onClick={() => setActiveSidebar('original')} />
      <Heading size="md" color="white" mb={4} mt={6} textAlign="center" width="90%">研究热榜</Heading>
      
      {/* 时间范围筛选按钮 */}
      <ButtonGroup size="sm" isAttached variant="outline" mb={4}>
        <MotionButton
          bg={trendingPeriod === 'day' ? activeBg : inactiveBg}
          color="white"
          borderColor="whiteAlpha.300"
          onClick={() => setTrendingPeriod('day')}
          whileHover={{ backgroundColor: trendingPeriod === 'day' ? activeBg : "#252525" }}
          whileTap={{ scale: 0.95 }}
        >
          日榜
        </MotionButton>
        <MotionButton
          bg={trendingPeriod === 'week' ? activeBg : inactiveBg}
          color="white"
          borderColor="whiteAlpha.300"
          onClick={() => setTrendingPeriod('week')}
          whileHover={{ backgroundColor: trendingPeriod === 'week' ? activeBg : "#252525" }}
          whileTap={{ scale: 0.95 }}
        >
          周榜
        </MotionButton>
        <MotionButton
          bg={trendingPeriod === 'month' ? activeBg : inactiveBg}
          color="white"
          borderColor="whiteAlpha.300"
          onClick={() => setTrendingPeriod('month')}
          whileHover={{ backgroundColor: trendingPeriod === 'month' ? activeBg : "#252525" }}
          whileTap={{ scale: 0.95 }}
        >
          月榜
        </MotionButton>
      </ButtonGroup>
      
      {/* 热榜文章列表 */}
      <Box 
        flex="1 1 auto" 
        overflow="auto" 
        width="90%" 
        px={0}
        display="flex" 
        justifyContent="center"
        alignItems="flex-start"
      >
        <TrendingArticleList />
      </Box>
    </Flex>
  );
};

export default TrendingContent; 